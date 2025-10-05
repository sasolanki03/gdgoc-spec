
'use server';

import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import type { TeamMember } from '@/lib/types';
import { revalidatePath } from 'next/cache';

type AddTeamMemberData = Omit<TeamMember, 'id' | 'socials'>;
type UpdateTeamMemberData = Omit<TeamMember, 'id' | 'socials'>;

export async function addTeamMember(data: AddTeamMemberData) {
    try {
        const adminApp = initializeAdminApp();
        if (!adminApp) {
            throw new Error('Firebase Admin SDK not initialized.');
        }
        const db = getFirestore(adminApp);
        const teamCollection = db.collection('team');
        
        const newMember: Omit<TeamMember, 'id'> = {
            ...data,
            socials: [], // Initialize with empty socials
        };

        await teamCollection.add(newMember);

        revalidatePath('/team');
        revalidatePath('/admin/dashboard/team');

        return { success: true };
    } catch (error: any) {
        console.error('Error adding team member:', error);
        return { success: false, error: error.message };
    }
}

export async function updateTeamMember(id: string, data: UpdateTeamMemberData) {
    try {
        const adminApp = initializeAdminApp();
        if (!adminApp) {
            throw new Error('Firebase Admin SDK not initialized.');
        }
        const db = getFirestore(adminApp);
        const docRef = db.collection('team').doc(id);

        // We don't update socials from this form, so we keep the existing ones
        const updatedData: Partial<UpdateTeamMemberData> = { ...data };

        await docRef.update(updatedData);

        revalidatePath('/team');
        revalidatePath('/admin/dashboard/team');

        return { success: true };
    } catch (error: any) {
        console.error('Error updating team member:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteTeamMember(id: string) {
    try {
        const adminApp = initializeAdminApp();
        if (!adminApp) {
            throw new Error('Firebase Admin SDK not initialized.');
        }
        const db = getFirestore(adminApp);
        await db.collection('team').doc(id).delete();

        revalidatePath('/team');
        revalidatePath('/admin/dashboard/team');

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting team member:', error);
        return { success: false, error: error.message };
    }
}
