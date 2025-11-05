
'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Calendar,
  Users,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { useMemo } from 'react';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { Event, EventRegistration, LeaderboardEntry, ContactMessage } from '@/lib/types';
import { format } from 'date-fns';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Dashboard() {
  const firestore = useFirestore();

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'));
  }, [firestore]);

  const registrationsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'registrations'), orderBy('registeredAt', 'desc'), limit(5));
  }, [firestore]);
  
  const allRegistrationsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'registrations'));
  }, [firestore]);

  const leaderboardQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leaderboard'), orderBy('completionTime', 'asc'), limit(1));
  }, [firestore]);
  
  const contactsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contacts'), orderBy('createdAt', 'desc'), limit(5));
  }, [firestore]);

  const { data: events, loading: loadingEvents } = useCollection<Event>(eventsQuery);
  const { data: recentRegistrations, loading: loadingRegistrations } = useCollection<EventRegistration>(registrationsQuery);
  const { data: allRegistrations, loading: loadingAllRegistrations } = useCollection<EventRegistration>(allRegistrationsQuery);
  const { data: leaderboard, loading: loadingLeaderboard } = useCollection<LeaderboardEntry>(leaderboardQuery);
  const { data: contacts, loading: loadingContacts } = useCollection<ContactMessage>(contactsQuery);

  const upcomingEventsCount = useMemo(() => {
    return events?.filter(e => e.status === 'Upcoming' || e.status === 'Continue').length || 0;
  }, [events]);

  const topStudent = useMemo(() => leaderboard?.[0], [leaderboard]);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingEvents ? <Skeleton className="h-8 w-10 mt-1" /> : <div className="text-2xl font-bold">{upcomingEventsCount}</div>}
            <p className="text-xs text-muted-foreground">
              Total upcoming & ongoing events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingAllRegistrations ? <Skeleton className="h-8 w-16 mt-1" /> : <div className="text-2xl font-bold">{allRegistrations?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">
              Across all events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Student</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingLeaderboard ? <Skeleton className="h-8 w-32 mt-1" /> : <div className="text-2xl font-bold truncate">{topStudent?.studentName || 'N/A'}</div>}
            <p className="text-xs text-muted-foreground">
              From all leaderboards
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingContacts ? <Skeleton className="h-8 w-10 mt-1" /> : <div className="text-2xl font-bold">{contacts?.length || 0}</div>}
            <p className="text-xs text-muted-foreground">
              Most recent messages
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>
                Last 5 registrations from your events.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/dashboard/registrations">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Event
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Date
                  </TableHead>
                  <TableHead className="text-right">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRegistrations ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell className="hidden xl:table-cell"><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-40 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : recentRegistrations && recentRegistrations.length > 0 ? (
                  recentRegistrations.map(reg => (
                    <TableRow key={reg.id}>
                      <TableCell>
                        <div className="font-medium">{reg.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {reg.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {reg.eventName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(reg.registeredAt.toDate(), 'PP')}
                      </TableCell>
                      <TableCell className="text-right">{reg.email}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No recent registrations.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Messages</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
          {loadingContacts ? (
             [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="grid gap-1 w-full">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))
          ) : contacts && contacts.length > 0 ? (
            contacts.map(msg => (
                <div key={msg.id} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{msg.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                        "{msg.subject}"
                        </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">{format(msg.createdAt.toDate(), 'p')}</div>
                </div>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-10">
              No recent messages.
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
