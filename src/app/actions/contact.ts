
'use server';

import 'server-only';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import { revalidatePath } from 'next/cache';

interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function sendContactMessage(data: ContactMessage) {
    try {
        const adminApp = initializeAdminApp();
        const db = getFirestore(adminApp);

        await db.collection('contacts').add({
            ...data,
            createdAt: FieldValue.serverTimestamp(),
            isRead: false,
        });

        revalidatePath('/admin/dashboard/contacts');

        return { success: true };
    } catch (error: any) {
        console.error('Error sending contact message:', error);
        return { success: false, error: 'Could not submit your message. Please try again later.' };
    }
}
