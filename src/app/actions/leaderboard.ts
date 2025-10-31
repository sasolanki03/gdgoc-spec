
'use server';

import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import type { LeaderboardEntry } from '@/lib/types';
import * as cheerio from 'cheerio';

type ScrapedData = {
    totalPoints: number;
    skillBadges: number;
    quests: number;
    genAIGames: number;
};

async function scrapeProfile(url: string): Promise<ScrapedData> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);

        // These selectors are highly likely to break. This is the fragile part of web scraping.
        const badges = $('span.ql-body-medium.l-m-0').map((i, el) => $(el).text().trim()).get();
        
        const skillBadges = parseInt(badges[0]?.match(/\d+/)?.[0] || '0');
        const quests = parseInt(badges[1]?.match(/\d+/)?.[0] || '0');
        const genAIGames = parseInt(badges[2]?.match(/\d+/)?.[0] || '0');

        let totalPoints = 0;
        // The total points logic might be more complex, for now we sum up what we can get.
        // This is a placeholder and might not be accurate.
        totalPoints = (skillBadges * 10) + (quests * 20) + (genAIGames * 30);


        return {
            totalPoints,
            skillBadges,
            quests,
            genAIGames
        };

    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        // Return zeros if scraping fails for a profile
        return { totalPoints: 0, skillBadges: 0, quests: 0, genAIGames: 0 };
    }
}


export async function updateLeaderboard(data: { studentName: string, profileId: string }[]) {
    try {
        const adminApp = initializeAdminApp();
        const db = getFirestore(adminApp);
        const leaderboardCollection = db.collection('leaderboard');
        
        const batch = db.batch();

        // Clear existing leaderboard
        const snapshot = await leaderboardCollection.get();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Add new data by scraping profiles
        for (const [index, entry] of data.entries()) {
            if (!entry.profileId || !entry.studentName) continue;

            const scrapedData = await scrapeProfile(entry.profileId);
            
            const docRef = leaderboardCollection.doc(entry.studentName.replace(/\s+/g, '-').toLowerCase());
            
            const newEntry: Omit<LeaderboardEntry, 'rank' | 'id'> = {
                student: {
                    name: entry.studentName,
                    avatar: `leader-${(index % 15) + 1}`,
                },
                totalPoints: scrapedData.totalPoints,
                skillBadges: scrapedData.skillBadges,
                quests: scrapedData.quests,
                genAIGames: scrapedData.genAIGames,
                profileId: entry.profileId,
            };
            batch.set(docRef, newEntry);
        }

        await batch.commit();

        return { success: true };
    } catch (error: any) {
        console.error('Error updating leaderboard:', error);
        const errorMessage = error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY')
            ? 'Firebase Admin setup is incomplete. Please check server configuration.'
            : 'Could not update the leaderboard. Please try again later.';
        return { success: false, error: errorMessage };
    }
}
