
'use client';

import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { PlusCircle, MoreHorizontal, Trash } from 'lucide-react';

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
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from '@/components/ui/button';
  import type { LeaderboardEntry } from '@/lib/types';
  import { useToast } from '@/hooks/use-toast';
  import { Skeleton } from '@/components/ui/skeleton';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { PlaceHolderImages } from '@/lib/placeholder-images';
  import { LeaderboardEntryForm } from '@/components/forms/leaderboard-entry-form';

export default function AdminLeaderboardPage() {
    const firestore = useFirestore();
    const leaderboardQuery = firestore ? query(collection(firestore, 'leaderboard'), orderBy('totalPoints', 'desc')) : null;
    const { data: leaderboardData, loading, error } = useCollection<Omit<LeaderboardEntry, 'rank'>>(leaderboardQuery);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
    const { toast } = useToast();

    const rankedData = leaderboardData?.map((entry, index) => ({ ...entry, rank: index + 1 })) || [];

    const handleAddEntry = async (data: Omit<LeaderboardEntry, 'id' | 'rank'>) => {
        if (!firestore) return;
        try {
            await addDoc(collection(firestore, 'leaderboard'), data);
            setIsDialogOpen(false);
            toast({
                title: 'Entry Added!',
                description: `${data.student.name} has been added to the leaderboard.`,
            });
        } catch (e: any) {
            console.error("Error adding document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Adding Entry',
                description: e.message,
            });
        }
    };

    const handleUpdateEntry = async (id: string, data: Partial<Omit<LeaderboardEntry, 'id' | 'rank'>>) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'leaderboard', id), data);
            setIsDialogOpen(false);
            setSelectedEntry(null);
            toast({
                title: 'Entry Updated!',
                description: "The entry's details have been saved.",
            });
        } catch (e: any) {
            console.error("Error updating document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Updating Entry',
                description: e.message,
            });
        }
    };

    const handleDeleteEntry = async (entryId: string, studentName: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'leaderboard', entryId));
            toast({
                title: 'Entry Deleted',
                description: `${studentName}'s entry has been removed from the leaderboard.`,
            });
        } catch (e: any) {
            console.error("Error deleting document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Deleting Entry',
                description: e.message,
            });
        }
    };
    
    const handleFormSuccess = (data: any) => {
        if (selectedEntry) {
            handleUpdateEntry(selectedEntry.id, data);
        } else {
            handleAddEntry(data);
        }
    };

    const handleEditClick = (entry: LeaderboardEntry) => {
        setSelectedEntry(entry);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedEntry(null);
        setIsDialogOpen(true);
    }

    return (
      <>
        <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Leaderboard Management</CardTitle>
                  <CardDescription>Add, edit, or delete leaderboard entries.</CardDescription>
                </div>
                <Button size="sm" className="gap-1" onClick={handleAddClick}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Entry
                    </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Skill Badges</TableHead>
                    <TableHead className="text-center">Quests</TableHead>
                    <TableHead className="text-center">GenAI Games</TableHead>
                    <TableHead className="text-right">Total Points</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="text-center"><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                            <TableCell>
                                <div className='flex items-center gap-2'>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </TableCell>
                            <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))
                  ) : rankedData.map((entry) => {
                    const avatarImage = PlaceHolderImages.find(img => img.id === entry.student.avatar);
                    return (
                        <TableRow key={entry.id}>
                            <TableCell className="font-medium text-center">{entry.rank}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                    {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={entry.student.name} />}
                                    <AvatarFallback>{entry.student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{entry.student.name}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">{entry.skillBadges}</TableCell>
                            <TableCell className="text-center">{entry.quests}</TableCell>
                            <TableCell className="text-center">{entry.genAIGames}</TableCell>
                            <TableCell className="text-right font-semibold">{entry.totalPoints}</TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end">
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={() => handleEditClick(entry)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialogTrigger asChild>
                                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete {entry.student.name}'s entry.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteEntry(entry.id, entry.student.name)} className="bg-destructive hover:bg-destructive/90">
                                                Delete
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                     )
                  })}
                </TableBody>
              </Table>
                {error && <p className='text-destructive text-center p-4'>Error: {error.message}</p>}
                 {!loading && rankedData.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No leaderboard entries yet.</p>
                    </div>
                 )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{rankedData.length}</strong> of <strong>{rankedData.length}</strong> entries
              </div>
            </CardFooter>
          </Card>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                if(!isOpen) setSelectedEntry(null);
                setIsDialogOpen(isOpen);
             }}>
                <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{selectedEntry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
                </DialogHeader>
                <LeaderboardEntryForm
                    entry={selectedEntry} 
                    onSuccess={handleFormSuccess}
                />
                </DialogContent>
            </Dialog>
        </>
    );
}
