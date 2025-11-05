
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal, Trash } from 'lucide-react';
import { collection, updateDoc, deleteDoc, doc, query, orderBy, addDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

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
  import type { TeamMember } from '@/lib/types';
  import { EditTeamMemberForm } from '@/components/forms/edit-team-member-form';
  import { AddTeamMemberForm } from '@/components/forms/add-team-member-form';
  import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminTeamPage() {
    const firestore = useFirestore();
    const teamQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'teamMembers'), orderBy('name', 'asc'));
    }, [firestore]);

    const { data: teamMembers, loading, error } = useCollection<TeamMember>(teamQuery);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const { toast } = useToast();
    
    const handleAddMember = async (newMemberData: Omit<TeamMember, 'id'>) => {
        if (!firestore) return;
        try {
            await addDoc(collection(firestore, 'teamMembers'), newMemberData);
            setIsAddDialogOpen(false);
            toast({
                title: 'Member Added!',
                description: `${newMemberData.name} has been added to the team.`,
            });
        } catch (e: any) {
            console.error("Error adding member:", e);
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    const handleUpdateMember = async (id: string, data: Partial<TeamMember>) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'teamMembers', id), data);
            setIsEditDialogOpen(false);
            setSelectedMember(null);
            toast({
                title: 'Member Updated!',
                description: "The team member's details have been saved.",
            });
        } catch (e: any) {
            console.error("Error updating document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Updating Member',
                description: e.message,
            });
        }
    };

    const handleDeleteMember = async (memberId: string, memberName: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'teamMembers', memberId));
            toast({
                title: 'Member Deleted',
                description: `${memberName} has been removed from the team.`,
            });
        } catch (e: any) {
            console.error("Error deleting document: ", e);
            toast({
                variant: 'destructive',
                title: 'Error Deleting Member',
                description: e.message,
            });
        }
    };

    const handleEditClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsEditDialogOpen(true);
    };

    return (
      <>
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Manage your GDGoC core team.</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Member
                        </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Add New Team Member</DialogTitle>
                    </DialogHeader>
                    <AddTeamMemberForm 
                        onSuccess={(data) => handleAddMember(data as Omit<TeamMember, 'id'>)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Photo</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Position
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Branch & Year
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="hidden sm:table-cell">
                                <Skeleton className="h-16 w-16 rounded-full" />
                            </TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))
                  ) : teamMembers && teamMembers.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt={member.name}
                                    className="aspect-square rounded-full object-cover"
                                    height="64"
                                    src={member.photo}
                                    width="64"
                                />
                            </TableCell>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.role}</TableCell>
                            <TableCell className="hidden md:table-cell">{member.position}</TableCell>
                            <TableCell className="hidden md:table-cell">{member.branch}, {member.year}</TableCell>
                            <TableCell>
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
                                            <DropdownMenuItem onSelect={() => handleEditClick(member)}>
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
                                            This action cannot be undone. This will permanently delete {member.name} from the team.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteMember(member.id, member.name)} className="bg-destructive hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                  ))}
                </TableBody>
              </Table>
                {error && <p className='text-destructive text-center p-4'>Error: {error.message}</p>}
                {!loading && teamMembers?.length === 0 && <p className="text-center py-16 text-muted-foreground">No team members found.</p>}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{teamMembers?.length || 0}</strong> of <strong>{teamMembers?.length || 0}</strong> members
              </div>
            </CardFooter>
          </Card>
           {selectedMember && (
             <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
                if(!isOpen) setSelectedMember(null);
                setIsEditDialogOpen(isOpen);
             }}>
                <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Edit {selectedMember.name}</DialogTitle>
                </DialogHeader>
                <EditTeamMemberForm 
                    member={selectedMember} 
                    onSuccess={(id, data) => handleUpdateMember(id, data)}
                />
                </DialogContent>
            </Dialog>
           )}
        </>
    );
}
