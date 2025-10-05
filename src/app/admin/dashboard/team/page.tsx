
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal, Trash } from 'lucide-react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';

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
  import { deleteTeamMember } from '@/app/actions/team';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminTeamPage() {
    const firestore = useFirestore();
    const { data: teamMembers, loading } = useCollection<TeamMember>(
        firestore ? collection(firestore, 'team') : null
    );

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const { toast } = useToast();

    const handleAddSuccess = () => {
        setIsAddDialogOpen(false);
        toast({
            title: 'Member Added!',
            description: `A new member has been added to the team.`,
        });
    }

    const handleEditSuccess = () => {
        setIsEditDialogOpen(false);
        setSelectedMember(null);
        toast({
            title: 'Member Updated!',
            description: `The team member's details have been saved.`,
        });
    }

    const handleEditClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsEditDialogOpen(true);
    };

    const handleDeleteMember = async (memberId: string, memberName: string) => {
      const result = await deleteTeamMember(memberId);
      if (result.success) {
        toast({
          title: 'Member Deleted',
          description: `${memberName} has been removed from the team.`,
        });
      } else {
        toast({
            variant: 'destructive',
            title: 'Error Deleting Member',
            description: result.error,
        });
      }
    };

    return (
      <>
        <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your GDG core team.</CardDescription>
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
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Add New Team Member</DialogTitle>
                    </DialogHeader>
                    <AddTeamMemberForm 
                        onSuccess={handleAddSuccess} 
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
                                <Skeleton className="h-8 w-8" />
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
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{teamMembers?.length || 0}</strong> of <strong>{teamMembers?.length || 0}</strong> members
              </div>
            </CardFooter>
          </Card>
           {selectedMember && (
             <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
                if(!isOpen) setSelectedMember(null);
                setIsEditDialogOpen(isOpen);
             }}>
                <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Edit {selectedMember.name}</DialogTitle>
                </DialogHeader>
                <EditTeamMemberForm 
                    member={selectedMember} 
                    onSuccess={handleEditSuccess}
                />
                </DialogContent>
            </Dialog>
           )}
        </>
    );
}
