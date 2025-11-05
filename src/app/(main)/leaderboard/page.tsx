
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Trophy, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { LeaderboardEntry, Event as EventType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-slate-400';
  if (rank === 3) return 'text-yellow-600';
  return 'text-muted-foreground';
};

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardEntry | null>(null);
  
  const firestore = useFirestore();
  
  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('startDate', 'desc'));
  }, [firestore]);

  const { data: events, loading: loadingEvents } = useCollection<EventType>(eventsQuery);

  const leaderboardQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leaderboard'));
  }, [firestore]);

  const { data: allLeaderboardData, loading } = useCollection<Omit<LeaderboardEntry, 'rank'>>(leaderboardQuery);

  const eventLeaderboardData = useMemo(() => {
    if (!allLeaderboardData || !selectedEventId) return [];
    return allLeaderboardData.filter(entry => entry.eventId === selectedEventId);
  }, [allLeaderboardData, selectedEventId]);

  const sortedData = useMemo(() => {
    if (!eventLeaderboardData) return [];
    const sorted = [...eventLeaderboardData].sort((a, b) => {
        if (a.completionTime && b.completionTime) {
            return a.completionTime.toDate().getTime() - b.completionTime.toDate().getTime();
        }
        if (a.completionTime) return -1;
        if (b.completionTime) return 1;
        return a.studentName.localeCompare(b.studentName);
    });
    return sorted.map((student, index) => ({ ...student, rank: index + 1 }));
  }, [eventLeaderboardData]);

  const filteredData = useMemo(() => {
    return sortedData.filter(entry =>
      entry.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId || !events) return null;
    return events.find(e => e.id === selectedEventId);
  }, [selectedEventId, events]);

  const handleRowClick = (entry: LeaderboardEntry) => {
    setSelectedStudent(entry);
  }

  return (
    <TooltipProvider>
      <div>
        <PageHeader
          title="Student Leaderboard"
          description="Track your progress and see how you stack up against your peers in our events and campaigns."
        />
        <div className="container mx-auto px-5 md:px-20 py-10">
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a student..."
                className="pl-10 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedEventId}
              />
            </div>
             <Select onValueChange={setSelectedEventId} value={selectedEventId || ''}>
              <SelectTrigger className="w-full md:w-[280px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {loadingEvents ? (
                  <SelectItem value="loading" disabled>Loading events...</SelectItem>
                ) : (
                  events?.map(event => (
                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {!selectedEventId ? (
            <Card>
                <CardContent className="flex flex-col items-center justify-center text-center py-16">
                     <Trophy className="h-16 w-16 text-muted-foreground mb-4"/>
                    <h3 className="text-2xl font-bold font-headline">Select an Event</h3>
                    <p className="text-muted-foreground mt-2">
                        Please choose an event from the dropdown to view its leaderboard.
                    </p>
                </CardContent>
            </Card>
          ) : (
            <Card>
                <CardContent className="pt-6">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-20 text-center">Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-center">Campaign Completed</TableHead>
                        <TableHead className="text-center">Completion Date</TableHead>
                        <TableHead className="text-center">Profile</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="text-center"><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                                <TableCell>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                </TableCell>
                                <TableCell className="text-center"><Skeleton className="h-6 w-6 mx-auto rounded-full" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                            </TableRow>
                            ))
                        ) : filteredData.length > 0 ? (
                        filteredData.map((entry) => {
                        const avatarImage = PlaceHolderImages.find(img => img.id === entry.avatar);
                        return (
                            <TableRow 
                                key={entry.id} 
                                className={cn(
                                'transition-colors cursor-pointer',
                                entry.rank <= 3 && 'bg-card',
                                {'bg-yellow-400/10 hover:bg-yellow-400/20': entry.rank === 1},
                                {'bg-slate-400/10 hover:bg-slate-400/20': entry.rank === 2},
                                {'bg-yellow-600/10 hover:bg-yellow-600/20': entry.rank === 3},
                                )}
                                onClick={() => handleRowClick(entry)}
                            >
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                <span className={cn('text-xl font-bold', getRankColor(entry.rank))}>
                                    {entry.rank}
                                </span>
                                {entry.rank <= 3 && <Trophy className={cn('h-5 w-5', getRankColor(entry.rank))} />}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                <Avatar>
                                    {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={entry.studentName} data-ai-hint={avatarImage.imageHint} />}
                                    <AvatarFallback>{entry.studentName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{entry.studentName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Tooltip>
                                    <TooltipTrigger>
                                    {entry.campaignCompleted ? (
                                        <CheckCircle className="h-6 w-6 text-google-green mx-auto" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-google-red mx-auto" />
                                    )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{entry.campaignCompleted ? "Completed" : "Not Completed"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">
                                {entry.completionTime ? format(entry.completionTime.toDate(), 'PP') : 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                                <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" asChild>
                                    <Link href={entry.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        <ExternalLink className="h-5 w-5 text-muted-foreground" />
                                        <span className="sr-only">View Profile</span>
                                    </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>View Google Cloud Skills Boost Profile</p>
                                </TooltipContent>
                                </Tooltip>
                            </TableCell>
                            </TableRow>
                        );
                        })
                        ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-16">
                                <h3 className="text-2xl font-bold font-headline">No Students Found</h3>
                                <p className="text-muted-foreground mt-2">
                                    {searchTerm ? "Try adjusting your search." : "The leaderboard is currently empty for this event."}
                                </p>
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
       {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={(isOpen) => !isOpen && setSelectedStudent(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl flex items-center gap-4">
                        <Trophy className={cn('h-8 w-8', getRankColor(selectedStudent.rank))} />
                        Rank #{selectedStudent.rank}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex items-center gap-4">
                         <Avatar className="h-24 w-24 border">
                            <AvatarImage src={PlaceHolderImages.find(img => img.id === selectedStudent.avatar)?.imageUrl} alt={selectedStudent.studentName} />
                            <AvatarFallback className="text-3xl">{selectedStudent.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-2xl font-bold font-headline">{selectedStudent.studentName}</h3>
                            <p className="text-muted-foreground">{selectedStudent.eventName}</p>
                        </div>
                    </div>
                    <Card>
                        <CardContent className="pt-6 grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                                <p className="font-medium">Completion Status</p>
                                {selectedStudent.campaignCompleted ? (
                                    <Badge variant="default" className="bg-google-green hover:bg-google-green/90">Completed</Badge>
                                ) : (
                                    <Badge variant="destructive">Not Completed</Badge>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">Completion Date</p>
                                <p className="text-muted-foreground">{selectedStudent.completionTime ? format(selectedStudent.completionTime.toDate(), 'PPP') : 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Button asChild>
                        <Link href={selectedStudent.profileUrl} target="_blank" rel="noopener noreferrer">
                            View Skills Boost Profile
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  );
}
