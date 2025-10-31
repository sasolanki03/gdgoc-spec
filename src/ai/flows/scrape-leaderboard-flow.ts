
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

    // This is highly dependent on the current structure of the skills boost profile page.
    // It's very likely to break if Google changes the page layout.
    // Updated selector to target the 'stat-and-label' component structure.
    $('ql-stat-and-label').each((i, elem) => {
        const statElem = $(elem).find('h3.ql-headline-2');
        const labelElem = $(elem).find('p.ql-body-medium');

        if (statElem.length && labelElem.length) {
            const count = parseInt(statElem.text().trim(), 10) || 0;
            const text = labelElem.text().trim();

            if (text.includes('Skill Badge')) { // "Skill Badges" or "Skill Badge"
                skillBadges = count;
            } else if (text.includes('Quest')) { // "Quests" or "Quest"
                quests = count;
            } else if (text.includes('GenAI Arcade Game')) { // "GenAI Arcade Games" or "Game"
                genAIGames = count;
            }
        }
    });

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
