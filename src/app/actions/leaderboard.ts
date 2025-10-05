
'use server';

import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import type { LeaderboardEntry } from '@/lib/types';

type LeaderboardData = Omit<LeaderboardEntry, 'rank' | 'student'> & {
    studentName: string;
};

export async function updateLeaderboard(data: LeaderboardData[]) {
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

        // Add new data
        data.forEach((entry, index) => {
            const docRef = leaderboardCollection.doc(entry.studentName.replace(/\s+/g, '-').toLowerCase());
            
            const newEntry: Omit<LeaderboardEntry, 'rank'> = {
                student: {
                    name: entry.studentName,
                    // Assign a random avatar from the available leader avatars
                    avatar: `leader-${(index % 15) + 1}`,
                },
                totalPoints: entry.totalPoints || 0,
                skillBadges: entry.skillBadges || 0,
                quests: entry.quests || 0,
                genAIGames: entry.genAIGames || 0,
                profileId: entry.profileId || '#',
            };
            batch.set(docRef, newEntry);
        });

        await batch.commit();

        return { success: true };
    } catch (error: any) {
        console.error('Error updating leaderboard:', error);
        return { success: false, error: error.message };
    }
}
