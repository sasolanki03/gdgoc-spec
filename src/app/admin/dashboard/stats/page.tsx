
'use client';

import { useState, useMemo } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { PlusCircle, MoreHorizontal, Trash, LucideIcon } from 'lucide-react';
import * as lucideIcons from 'lucide-react';

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
  import type { StatItem } from '@/lib/types';
  import { useToast } from '@/hooks/use-toast';
  import { Skeleton } from '@/components/ui/skeleton';
  import { StatForm } from '@/components/forms/stat-form';

export default function AdminStatsPage() {
    const firestore = useFirestore();
    const statsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'stats'), orderBy('order', 'asc'));
    }, [firestore]);

    const { data: stats, loading, error } = useCollection<StatItem>(statsQuery);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState<StatItem | null>(null);
    const { toast } = useToast();

    const handleFormSuccess = async (data: Omit<StatItem, 'id'>) => {
        if (!firestore) return;
        
        try {
            if (selectedStat) {
                // Update existing stat
                await updateDoc(doc(firestore, 'stats', selectedStat.id), data);
                toast({
                    title: 'Stat Updated!',
                    description: `The '${data.label}' stat has been saved.`,
                });
            } else {
                // Add new stat
                await addDoc(collection(firestore, 'stats'), data);
                toast({
                    title: 'Stat Added!',
                    description: `The '${data.label}' stat has been added.`,
                });
            }
            setIsFormOpen(false);
            setSelectedStat(null);
        } catch (e: any) {
            console.error("Error saving document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Saving Stat',
                description: e.message,
            });
        }
    };

    const handleDeleteStat = async (statId: string, statLabel: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'stats', statId));
            toast({
                title: 'Stat Deleted',
                description: `The '${statLabel}' stat has been removed.`,
            });
        } catch (e: any) {
            console.error("Error deleting document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Deleting Stat',
                description: e.message,
            });
        }
    };

    const handleEditClick = (stat: StatItem) => {
        setSelectedStat(stat);
        setIsFormOpen(true);
    };

    const handleAddClick = () => {
        setSelectedStat(null);
        setIsFormOpen(true);
    }
    
    return (
      <>
        <Card className="w-full mx-auto">
            <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Homepage Stats</CardTitle>
                    <CardDescription>Manage the statistics displayed on the homepage.</CardDescription>
                </div>
                <Button size="sm" className="gap-1" onClick={handleAddClick}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Stat
                    </span>
                </Button>
            </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16 text-center">Order</TableHead>
                            <TableHead className="w-20 text-center">Icon</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-5 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-10 w-10 rounded-full mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            stats?.map((stat) => {
                                const Icon = (lucideIcons as Record<string, LucideIcon>)[stat.icon];
                                return (
                                    <TableRow key={stat.id}>
                                        <TableCell className="font-medium text-center">{stat.order}</TableCell>
                                        <TableCell className="text-center">
                                            {Icon && <Icon className={`h-6 w-6 mx-auto ${stat.color}`} />}
                                        </TableCell>
                                        <TableCell>{stat.label}</TableCell>
                                        <TableCell>{stat.value}</TableCell>
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
                                                            <DropdownMenuItem onSelect={() => handleEditClick(stat)}>
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
                                                            This action cannot be undone. This will permanently delete the '{stat.label}' stat.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteStat(stat.id, stat.label)} className="bg-destructive hover:bg-destructive/90">
                                                            Delete
                                                        </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
                {error && <p className='text-destructive text-center p-4'>Error: {error.message}</p>}
                {!loading && stats?.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No stats found. Add one to get started.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{stats?.length || 0}</strong> stats
            </div>
            </CardFooter>
        </Card>
        
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
            if(!isOpen) setSelectedStat(null);
            setIsFormOpen(isOpen);
            }}>
            <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{selectedStat ? 'Edit' : 'Add'} Stat</DialogTitle>
                <DialogDescription>
                    {selectedStat ? 'Update the details for this stat.' : 'Add a new stat to the homepage.'}
                </DialogDescription>
            </DialogHeader>
            <StatForm
                key={selectedStat?.id || 'new'}
                stat={selectedStat} 
                onSuccess={handleFormSuccess}
            />
            </DialogContent>
        </Dialog>
      </>
    );
}
