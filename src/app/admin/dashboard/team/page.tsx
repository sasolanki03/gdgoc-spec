'use client';

import { useState } from 'react';
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
  import { teamMembers } from '@/lib/placeholder-data';
  import Image from 'next/image';
  import { PlaceHolderImages } from '@/lib/placeholder-images';
  import type { TeamMember } from '@/lib/types';
  import { EditTeamMemberForm } from '@/components/forms/edit-team-member-form';
  import { AddTeamMemberForm } from '@/components/forms/add-team-member-form';
  import { useToast } from '@/hooks/use-toast';

export default function AdminTeamPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const { toast } = useToast();

    const handleEditClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsEditDialogOpen(true);
    };

    const handleDeleteMember = (memberId: string) => {
      // This is where you would call your server action to delete from Firestore.
      // e.g., await deleteTeamMember(memberId);
      console.log(`Deleting member ${memberId}`);

      toast({
        title: 'Member Deleted',
        description: 'The team member has been removed.',
      });
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
                        onSuccess={() => setIsAddDialogOpen(false)} 
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
                  {teamMembers.map((member) => {
                     const image = PlaceHolderImages.find(img => img.id === member.photo);
                     return (
                        <TableRow key={member.id}>
                            <TableCell className="hidden sm:table-cell">
                                {image && 
                                    <Image
                                        alt={member.name}
                                        className="aspect-square rounded-full object-cover"
                                        height="64"
                                        src={image.imageUrl}
                                        width="64"
                                    />
                                }
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
                                            <DropdownMenuItem onClick={() => handleEditClick(member)}>
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
                                        <AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive hover:bg-destructive/90">
                                            Delete
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                     )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{teamMembers.length}</strong> of <strong>{teamMembers.length}</strong> members
              </div>
            </CardFooter>
          </Card>
           {selectedMember && (
             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Edit {selectedMember.name}</DialogTitle>
                </DialogHeader>
                <EditTeamMemberForm 
                    member={selectedMember} 
                    onSuccess={() => setIsEditDialogOpen(false)} 
                />
                </DialogContent>
            </Dialog>
           )}
        </>
    );
}
