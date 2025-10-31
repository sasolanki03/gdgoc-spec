
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import type { ContactMessage } from '@/lib/types';
import { format } from 'date-fns';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminContactsPage() {
    const firestore = useFirestore();
    const messagesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'contacts'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: messages, loading } = useCollection<ContactMessage>(messagesQuery);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View messages submitted through the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                    </div>
                ) : messages && messages.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                        {messages.map((msg) => (
                            <AccordionItem value={msg.id} key={msg.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4">
                                        <div className="text-left">
                                            <p className="font-semibold">{msg.subject}</p>
                                            <p className="text-sm text-muted-foreground">{msg.name} - {msg.email}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground self-center">
                                            {msg.createdAt ? format(new Date(msg.createdAt.toDate()), 'PP') : 'No date'}
                                        </p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 bg-muted/50 rounded-md">
                                    {msg.message}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No contact messages yet.</p>
                    </div>
                )}
            </CardContent>
             <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{loading ? 0 : messages?.length || 0}</strong> of <strong>{loading ? 0 : messages?.length || 0}</strong> messages
              </div>
            </CardFooter>
        </Card>
    );
}
