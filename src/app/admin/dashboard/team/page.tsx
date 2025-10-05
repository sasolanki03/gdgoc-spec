'use client';

import { useState } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from '@/components/ui/button';
  import { teamMembers } from '@/lib/placeholder-data';
  import Image from 'next/image';
  import { PlaceHolderImages } from '@/lib/placeholder-images';
  import type { TeamMember } from '@/lib/types';
  import { EditTeamMemberForm } from '@/components/forms/edit-team-member-form';

export default function AdminTeamPage() {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const handleEditClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsEditDialogOpen(true);
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
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Member
                    </span>
                </Button>
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
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                     )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-8</strong> of <strong>8</strong> members
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