
'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  import { Badge } from '@/components/ui/badge';
  import { events as initialEvents } from '@/lib/placeholder-data';
  import { PlaceHolderImages } from '@/lib/placeholder-images';
  import type { Event } from '@/lib/types';
  import { useToast } from '@/hooks/use-toast';
  import { EventForm } from '@/components/forms/event-form';

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { toast } = useToast();

    const handleAddEvent = (newEventData: Omit<Event, 'id'>) => {
      const newEvent: Event = {
        id: (events.length + 1).toString(),
        ...newEventData,
      };

      setEvents((prevEvents) => [newEvent, ...prevEvents]);
      setIsAddDialogOpen(false);
      toast({
        title: 'Event Added!',
        description: `${newEvent.title} has been created.`,
      });
    };

    const handleEditEvent = (updatedEvent: Event) => {
        setEvents((prevEvents) => 
            prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
        );
        setIsEditDialogOpen(false);
        toast({
            title: 'Event Updated!',
            description: `${updatedEvent.title}'s details have been saved.`,
        });
    }

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEditDialogOpen(true);
    };

    const handleDeleteEvent = (eventId: string) => {
      const eventToDelete = events.find(e => e.id === eventId);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));

      toast({
        title: 'Event Deleted',
        description: `${eventToDelete?.title} has been removed.`,
      });
    };

    return (
      <>
        <Card>
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
                  {events.map((event) => {
                     const image = PlaceHolderImages.find(img => img.id === event.imageUrl);
                     return (
                        <TableRow key={event.id}>
                            <TableCell className="hidden sm:table-cell">
                                {image ? 
                                    <Image
                                        alt={event.title}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={image.imageUrl}
                                        width="64"
                                    />
                                :
                                    <div className="aspect-square rounded-md bg-muted w-16 h-16" />
                                }
                            </TableCell>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>
                                <Badge variant={event.status === 'Upcoming' ? 'default': 'secondary'}>{event.status}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{event.venue}</TableCell>
                            <TableCell className="hidden md:table-cell">{event.date}</TableCell>
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
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{events.length}</strong> of <strong>{events.length}</strong> events
              </div>
            </CardFooter>
          </Card>
          {selectedEvent && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
