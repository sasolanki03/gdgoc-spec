
'use server';
/**
 * @fileOverview A flow for scraping Google Cloud Skills Boost profiles.
 *
 * - scrapeAndProcessProfiles - A function that takes profile data and returns leaderboard entries.
 * - ProfileScrapeInput - The input type for the scraping flow.
 * - LeaderboardScrapeOutput - The return type for the scraping flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as cheerio from 'cheerio';
import type { LeaderboardEntry } from '@/lib/types';

const ProfileScrapeInputSchema = z.array(z.object({
  studentName: z.string(),
  profileId: z.string().url(),
}));
export type ProfileScrapeInput = z.infer<typeof ProfileScrapeInputSchema>;

const LeaderboardEntryScrapeSchema = z.object({
    student: z.object({
        name: z.string(),
        avatar: z.string(),
    }),
    profileId: z.string(),
    totalPoints: z.number(),
    skillBadges: z.number(),
    quests: z.number(),
    genAIGames: z.number(),
});

// We use `z.nullable()` to correctly handle cases where a scrape might fail.
const LeaderboardScrapeOutputSchema = z.array(z.nullable(LeaderboardEntryScrapeSchema));
export type LeaderboardScrapeOutput = (Omit<LeaderboardEntry, 'id' | 'rank'> | null)[];


export async function scrapeAndProcessProfiles(input: ProfileScrapeInput): Promise<LeaderboardScrapeOutput> {
  return scrapeLeaderboardFlow(input);
}


async function scrapeProfile(url: string, name: string): Promise<Omit<LeaderboardEntry, 'id' | 'rank'> | null> {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Failed to fetch profile ${url}: ${response.statusText}`);
      return null;
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    let skillBadges = 0;
    let quests = 0;
    let genAIGames = 0;

    // The reliable way: find the script tag with the data.
    let profileData: any = null;
    $('script').each((i, el) => {
        const scriptContent = $(el).html();
        if (scriptContent && scriptContent.includes('PROJECT_APP_STATE')) {
            // Extract the JSON part from the script content
            const jsonString = scriptContent.substring(scriptContent.indexOf('{'));
            try {
                profileData = JSON.parse(jsonString);
                return false; // Break the loop
            } catch (e) {
                console.error('Failed to parse profile data JSON from script tag', e);
            }
        }
    });

    if (profileData && profileData.badges) {
        profileData.badges.forEach((badge: any) => {
            const badgeTitle = badge.title || '';
            if (badge.badge_type === 'SKILL_BADGE') {
                skillBadges++;
            } else if (badge.badge_type === 'QUEST') {
                quests++;
            } else if (badgeTitle.toLowerCase().includes('genai arcade')) {
                genAIGames++;
            }
        });
    } else {
        console.warn(`Could not find PROJECT_APP_STATE or badges array for ${url}. Scraping might be unreliable.`);
        // Fallback to less reliable method if needed, but for now, we'll rely on the JSON.
    }


    const totalPoints = skillBadges + quests + genAIGames;
    
    // Create a simple avatar ID from the name
    const avatarId = `leader-${Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 15 + 1}`;

    return {
      student: { name, avatar: avatarId },
      profileId: url,
      totalPoints,
      skillBadges,
      quests,
      genAIGames,
    };
  } catch (error) {
    console.error(`Error scraping profile ${url}:`, error);
    return null;
  }
}


const scrapeLeaderboardFlow = ai.defineFlow(
  {
    name: 'scrapeLeaderboardFlow',
    inputSchema: ProfileScrapeInputSchema,
    outputSchema: LeaderboardScrapeOutputSchema,
  },
  async (profiles) => {
    const scrapedDataPromises = profiles.map(profile => scrapeProfile(profile.profileId, profile.studentName));
    const results = await Promise.all(scrapedDataPromises);
    return results;
  }
);
