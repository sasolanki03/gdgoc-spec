
'use client';

import { useState, useMemo } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { PlusCircle, MoreHorizontal, Trash, CheckCircle, XCircle, Upload } from 'lucide-react';
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
    
    const leaderboardQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'leaderboard'), orderBy('completionTime', 'asc'));
    }, [firestore]);

    const { data: leaderboardData, loading, error } = useCollection<Omit<LeaderboardEntry, 'rank'>>(leaderboardQuery);

    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
    const { toast } = useToast();

    const rankedData = useMemo(() => leaderboardData?.map((entry, index) => ({ ...entry, rank: index + 1 })) || [], [leaderboardData]);

    const handleFormSuccess = async (data: Omit<LeaderboardEntry, 'id' | 'rank' | 'avatar'>) => {
        if (!firestore) return;
        
        try {
            if (selectedEntry) {
                // Update existing entry
                await updateDoc(doc(firestore, 'leaderboard', selectedEntry.id), data);
                toast({
                    title: 'Entry Updated!',
                    description: `${data.studentName}'s details have been saved.`,
                });
            } else {
                // Add new entry
                const avatarId = `leader-${Math.abs(data.studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 15 + 1}`;
                await addDoc(collection(firestore, 'leaderboard'), { ...data, avatar: avatarId });
                toast({
                    title: 'Entry Added!',
                    description: `${data.studentName} has been added to the leaderboard.`,
                });
            }
            setIsFormDialogOpen(false);
            setSelectedEntry(null);
        } catch (e: any) {
            console.error("Error saving document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Saving Entry',
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
    
    const handleBulkUpload = async (entries: Omit<LeaderboardEntry, 'id' | 'rank' | 'avatar'>[]) => {
        if (!firestore) return;
        
        const batch = writeBatch(firestore);
        
        entries.forEach(entry => {
            const docRef = doc(collection(firestore, 'leaderboard'));
            const avatarId = `leader-${Math.abs(entry.studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 15 + 1}`;
            batch.set(docRef, {...entry, avatar: avatarId });
        });

        try {
            await batch.commit();
            toast({
                title: 'Bulk Upload Successful!',
                description: `${entries.length} entries have been added to the leaderboard.`,
            });
            setIsUploadDialogOpen(false);
        } catch (e: any) {
            console.error("Error committing batch: ", e);
            toast({
                variant: 'destructive',
                title: 'Error during Bulk Upload',
                description: e.message,
            });
        }
    };

    const handleEditClick = (entry: LeaderboardEntry) => {
        setSelectedEntry(entry);
        setIsFormDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedEntry(null);
        setIsFormDialogOpen(true);
    }
    
    return (
      <>
        <Card className="w-full mx-auto">
            <CardHeader>
            <div className="flex items-center justify-between gap-4">
                <div>
                <CardTitle>Leaderboard Management</CardTitle>
                <CardDescription>Manually add, edit, or delete leaderboard entries.</CardDescription>
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
                        <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                                <DialogTitle className="font-headline text-2xl">Bulk Upload Entries</DialogTitle>
                                <DialogDescription>
                                    Upload a CSV file with student data. The file must contain the following columns: `studentName`, `profileUrl`, `campaignCompleted`, `completionTime`.
                                </DialogDescription>
                            </DialogHeader>
                            <LeaderboardUploadForm onSuccess={handleBulkUpload} />
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
                    <TableHead className="text-center">Campaign Completed</TableHead>
                    <TableHead className="text-center">Completion Date</TableHead>
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
                            <TableCell className="text-center"><Skeleton className="h-6 w-6 rounded-full mx-auto" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-5 w-40 mx-auto" /></TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))
                ) : rankedData.map((entry) => {
                    const avatarImage = PlaceHolderImages.find(img => img.id === entry.avatar);
                    return (
                        <TableRow key={entry.id}>
                            <TableCell className="font-medium text-center">{entry.rank}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                <Avatar className="hidden h-9 w-9 sm:flex">
                                    {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={entry.studentName} />}
                                    <AvatarFallback>{entry.studentName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{entry.studentName}</div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {entry.campaignCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                {entry.completionTime ? format(entry.completionTime.toDate(), 'dd MMM yyyy') : 'N/A'}
                            </TableCell>
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
                                                This action cannot be undone. This will permanently delete {entry.studentName}'s entry.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteEntry(entry.id, entry.studentName)} className="bg-destructive hover:bg-destructive/90">
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
        
        <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => {
            if(!isOpen) setSelectedEntry(null);
            setIsFormDialogOpen(isOpen);
            }}>
            <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{selectedEntry ? 'Edit' : 'Add'} Leaderboard Entry</DialogTitle>
                <DialogDescription>
                    {selectedEntry ? 'Manually update the details for this entry.' : 'Add a new student to the leaderboard.'}
                </DialogDescription>
            </DialogHeader>
            <LeaderboardEntryForm
                key={selectedEntry?.id || 'new'}
                entry={selectedEntry} 
                onSuccess={handleFormSuccess}
            />
            </DialogContent>
        </Dialog>
      </>
    );
}

    

    