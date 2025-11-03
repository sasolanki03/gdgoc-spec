
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Trophy, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { LeaderboardEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-slate-400';
  if (rank === 3) return 'text-yellow-600';
  return 'text-muted-foreground';
};

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();
  
  const leaderboardQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leaderboard'), orderBy('completionTime', 'asc'));
  }, [firestore]);

  const { data: leaderboardData, loading } = useCollection<Omit<LeaderboardEntry, 'rank'>>(leaderboardQuery);

  const sortedData = useMemo(() => {
    if (!leaderboardData) return [];
    // The data is already sorted by the query, so we just add the rank
    return leaderboardData.map((student, index) => ({ ...student, rank: index + 1 }));
  }, [leaderboardData]);

  const filteredData = useMemo(() => {
    return sortedData.filter(entry =>
      entry.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedData, searchTerm]);

  return (
    <TooltipProvider>
      <div>
        <PageHeader
          title="Student Leaderboard"
          description="Track your progress and see how you stack up against your peers in the Google Cloud Career Practitioner campaign."
        />
        <div className="container max-w-7xl py-16">
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a student..."
                className="pl-10 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20 text-center">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Campaign Completed</TableHead>
                      <TableHead className="text-center">Completion Time</TableHead>
                      <TableHead className="text-center">Profile</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-16">
                                Loading leaderboard...
                            </TableCell>
                        </TableRow>
                    ) : filteredData.length > 0 ? (
                      filteredData.map((entry) => {
                      const avatarImage = PlaceHolderImages.find(img => img.id === entry.avatar);
                      return (
                        <TableRow key={entry.id} className={cn(
                          'transition-colors',
                          entry.rank <= 3 && 'bg-card',
                          {'bg-yellow-400/10 hover:bg-yellow-400/20': entry.rank === 1},
                          {'bg-slate-400/10 hover:bg-slate-400/20': entry.rank === 2},
                          {'bg-yellow-600/10 hover:bg-yellow-600/20': entry.rank === 3},
                        )}>
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
                            {entry.completionTime ? format(entry.completionTime.toDate(), 'PPpp') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-center">
                             <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={entry.profileUrl} target="_blank" rel="noopener noreferrer">
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
                                {searchTerm ? "Try adjusting your search." : "The leaderboard is currently empty."}
                            </p>
                          </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
