
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal, Trash } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

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
  import { Badge } from '@/components/ui/badge';
  import { PlaceHolderImages } from '@/lib/placeholder-images';
  import type { Event } from '@/lib/types';
  import { useToast } from '@/hooks/use-toast';
  import { EventForm } from '@/components/forms/event-form';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function AdminEventsPage() {
    const firestore = useFirestore();
    const eventsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'events'), orderBy('date', 'desc'));
    }, [firestore]);

    const { data: events, loading, error } = useCollection<Event>(eventsQuery);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { toast } = useToast();

    const getBadgeVariant = (status: Event['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
          case 'Upcoming':
            return 'default';
          case 'Continue':
            return 'outline';
          case 'Past':
            return 'secondary';
          default:
            return 'secondary';
        }
    };

    const handleAddEvent = async (newEventData: Omit<Event, 'id'>) => {
        if (!firestore) return;
        try {
            await addDoc(collection(firestore, 'events'), newEventData);
            setIsAddDialogOpen(false);
            toast({
                title: 'Event Added!',
                description: `${newEventData.title} has been created.`,
            });
        } catch (e: any) {
            console.error("Error adding event:", e);
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    const handleEditEvent = async (updatedEventData: Omit<Event, 'id'>) => {
        if (!firestore || !selectedEvent) return;
        try {
            await updateDoc(doc(firestore, 'events', selectedEvent.id), updatedEventData);
            setIsEditDialogOpen(false);
            setSelectedEvent(null);
            toast({
                title: 'Event Updated!',
                description: `${updatedEventData.title}'s details have been saved.`,
            });
        } catch (e: any) {
            console.error("Error updating event:", e);
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    }

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEditDialogOpen(true);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!firestore) return;
        const eventToDelete = events?.find(e => e.id === eventId);
        try {
            await deleteDoc(doc(firestore, 'events', eventId));
            toast({
                title: 'Event Deleted',
                description: `${eventToDelete?.title} has been removed.`,
            });
        } catch (e: any) {
            console.error("Error deleting event:", e);
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    return (
      <>
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>Manage your upcoming and past events.</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Event
                        </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Add New Event</DialogTitle>
                    </DialogHeader>
                    <EventForm onSuccess={handleAddEvent} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Venue
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date
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
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : events?.map((event) => {
                     const isPlaceholder = !event.imageUrl.startsWith('data:');
                     const image = isPlaceholder ? PlaceHolderImages.find(img => img.id === event.imageUrl) : null;
                     const imageUrl = image ? image.imageUrl : (event.imageUrl || 'https://picsum.photos/seed/placeholder/64/64');
                     
                     return (
                        <TableRow key={event.id}>
                            <TableCell className="hidden sm:table-cell">
                                <Image
                                    alt={event.title}
                                    className="aspect-square rounded-md object-cover"
                                    height="64"
                                    src={imageUrl}
                                    width="64"
                                />
                            </TableCell>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>
                                <Badge 
                                    variant={getBadgeVariant(event.status)}
                                    className={cn({
                                        'bg-google-green hover:bg-google-green/90 text-white': event.status === 'Upcoming',
                                        'bg-google-yellow hover:bg-google-yellow/90 text-black': event.status === 'Continue',
                                    })}
                                >
                                    {event.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{event.venue}</TableCell>
                            <TableCell className="hidden md:table-cell">{format(event.date.toDate(), 'PPP')}</TableCell>
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
                                            <DropdownMenuItem onSelect={() => handleEditClick(event)}>
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
                                                This action cannot be undone. This will permanently delete the event "{event.title}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-destructive hover:bg-destructive/90">
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
              {error && <p className="text-sm text-destructive text-center p-4">Error loading events: {error.message}</p>}
              {!loading && events?.length === 0 && <p className="text-sm text-muted-foreground text-center p-4">No events found.</p>}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{events?.length || 0}</strong> of <strong>{events?.length || 0}</strong> events
              </div>
            </CardFooter>
          </Card>
          {selectedEvent && (
            <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
                if (!isOpen) setSelectedEvent(null);
                setIsEditDialogOpen(isOpen);
            }}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Edit {selectedEvent.title}</DialogTitle>
                    </DialogHeader>
                    <EventForm event={selectedEvent} onSuccess={handleEditEvent} />
                </DialogContent>
            </Dialog>
          )}
        </>
    );
}
