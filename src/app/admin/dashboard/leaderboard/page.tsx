
'use client';

import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { PlusCircle, MoreHorizontal, Trash, Upload } from 'lucide-react';

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
    DialogDescription,
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
  import { LeaderboardUploadForm } from '@/components/forms/leaderboard-upload-form';

export default function AdminLeaderboardPage() {
    const firestore = useFirestore();
    const leaderboardQuery = firestore ? query(collection(firestore, 'leaderboard'), orderBy('totalPoints', 'desc')) : null;
    const { data: leaderboardData, loading, error, refetch } = useCollection<Omit<LeaderboardEntry, 'rank'>>(leaderboardQuery);

    const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
    const { toast } = useToast();

    const rankedData = leaderboardData?.map((entry, index) => ({ ...entry, rank: index + 1 })) || [];

    const handleAddEntry = async (data: Omit<LeaderboardEntry, 'id' | 'rank'>) => {
        if (!firestore) return;
        try {
            await addDoc(collection(firestore, 'leaderboard'), data);
            setIsEntryDialogOpen(false);
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
            setIsEntryDialogOpen(false);
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
    
    const handleFormSuccess = (data: Omit<LeaderboardEntry, 'id'|'rank'>) => {
        if (selectedEntry) {
            handleUpdateEntry(selectedEntry.id, data);
        } else {
            handleAddEntry(data);
        }
    };

    const handleEditClick = (entry: LeaderboardEntry) => {
        setSelectedEntry(entry);
        setIsEntryDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedEntry(null);
        setIsEntryDialogOpen(true);
    }
    
    const handleUploadSuccess = async (scrapedData: Omit<LeaderboardEntry, 'id'|'rank'>[]) => {
      if (!firestore) return;
    
      const batch = writeBatch(firestore);
    
      // 1. Find existing documents to delete them
      const snapshot = await collection(firestore, 'leaderboard').get();
      snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
      });
    
      // 2. Add all new documents
      scrapedData.forEach(entry => {
        const newDocRef = doc(collection(firestore, 'leaderboard'));
        batch.set(newDocRef, entry);
      });
    
      try {
        await batch.commit();
        toast({
          title: 'Leaderboard Updated Successfully!',
          description: `${scrapedData.length} entries have been synced.`,
        });
        setIsUploadDialogOpen(false);
        // We don't need to call refetch() here as onSnapshot will automatically update the UI.
      } catch (e: any) {
        console.error("Error during batch write: ", e);
        toast({
          variant: 'destructive',
          title: 'Failed to Update Leaderboard',
          description: e.message,
        });
      }
    };

    return (
      <>
        <Card>
            <CardHeader>
            <div className="flex items-center justify-between gap-4">
                <div>
                <CardTitle>Leaderboard Management</CardTitle>
                <CardDescription>Add, edit, delete, or bulk upload leaderboard entries.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                                <Upload className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Bulk Upload
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] flex flex-col">
                            <DialogHeader>
                                <DialogTitle className="font-headline text-2xl">Bulk Upload Leaderboard</DialogTitle>
                                <DialogDescription>
                                    Upload a CSV file with `studentName` and `profileId` to scrape and update the entire leaderboard.
                                </DialogDescription>
                            </DialogHeader>
                            <LeaderboardUploadForm onSuccess={handleUploadSuccess} />
                        </DialogContent>
                    </Dialog>
                    <Button size="sm" className="gap-1" onClick={handleAddClick}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Entry
                        </span>
                    </Button>
                </div>
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
                                                    Edit & Rescrape
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
        <Dialog open={isEntryDialogOpen} onOpenChange={(isOpen) => {
            if(!isOpen) setSelectedEntry(null);
            setIsEntryDialogOpen(isOpen);
            }}>
            <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{selectedEntry ? 'Edit and Rescrape Entry' : 'Add New Entry'}</DialogTitle>
                <DialogDescription>
                    {selectedEntry ? 'Update the name or URL, and the system will re-fetch the data.' : 'Enter the student name and profile URL to scrape their data.'}
                </DialogDescription>
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
