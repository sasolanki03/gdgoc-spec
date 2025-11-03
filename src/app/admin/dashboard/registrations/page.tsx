
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import type { EventRegistration } from '@/lib/types';
import { format } from 'date-fns';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminRegistrationsPage() {
    const firestore = useFirestore();
    const registrationsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'registrations'), orderBy('registeredAt', 'desc'));
    }, [firestore]);

    const { data: registrations, loading } = useCollection<EventRegistration>(registrationsQuery);

    return (
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
                <CardDescription>View and manage all event registrations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">Event</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden md:table-cell">Year</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                                </TableRow>
                            ))
                        ) : registrations && registrations.length > 0 ? (
                            registrations.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.name}</TableCell>
                                    <TableCell>{reg.email}</TableCell>
                                    <TableCell className="hidden md:table-cell">{reg.eventName}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {reg.registeredAt ? format(new Date(reg.registeredAt.toDate()), 'PP') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{reg.year}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16">
                                    No registrations yet.
                                 </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{registrations?.length || 0}</strong> of <strong>{registrations?.length || 0}</strong> registrations
              </div>
            </CardFooter>
        </Card>
    );
}
