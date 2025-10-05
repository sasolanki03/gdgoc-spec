
'use server';

import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import type { TeamMember } from '@/lib/types';
import { revalidatePath } from 'next/cache';

type AddTeamMemberData = Omit<TeamMember, 'id' | 'socials'> & {
    photo: string;
    socials?: any[];
};
type UpdateTeamMemberData = Omit<TeamMember, 'id' | 'socials'>;

export async function addTeamMember(data: AddTeamMemberData) {
    try {
        const adminApp = initializeAdminApp();
        const db = getFirestore(adminApp);
        const teamCollection = db.collection('team');

        const newMemberData: Omit<TeamMember, 'id'> = {
            name: data.name,
            role: data.role,
            position: data.position,
            branch: data.branch,
            year: data.year,
            photo: data.photo,
            bio: data.bio,
            socials: [], // Always initialize with empty socials
        };

        await teamCollection.add(newMemberData);

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
        const db = getFirestore(adminApp);
        const docRef = db.collection('team').doc(id);

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
