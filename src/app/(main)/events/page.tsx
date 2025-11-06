'use client';

import { useState, useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

import type { Event as EventType } from '@/lib/types';
import { PageHeader } from '@/components/shared/page-header';
import { EventCard } from '@/components/shared/event-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EventRegistrationForm } from '@/components/forms/event-registration-form';
import { Skeleton } from '@/components/ui/skeleton';

const EventSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full mt-2" />
            </div>
        ))}
    </div>
)

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const firestore = useFirestore();

  const eventsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'events'), orderBy('startDate', 'desc'));
  }, [firestore]);

  const { data: events, isLoading: loading } = useCollection<EventType>(eventsQuery);

  const upcomingEvents = useMemo(() => events?.filter(e => e.status === 'Upcoming' || e.status === 'Continue') || [], [events]);
  const pastEvents = useMemo(() => events?.filter(e => e.status === 'Past') || [], [events]);
  
  const handleEventClick = (event: EventType) => {
    if(event.status === 'Upcoming' || event.status === 'Continue') {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  }

  return (
    <div>
      <PageHeader
        title="Events"
        description="Join our workshops, hackathons, and tech talks. Learn new skills, build cool projects, and connect with the community."
      />
      <div className="container mx-auto px-5 md:px-20 py-10">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-96 md:mx-auto">
            <TabsTrigger value="upcoming">Upcoming & Ongoing</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-8">
            {loading ? (
                <EventSkeleton />
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map(event => (
                  <div key={event.id} onClick={() => handleEventClick(event)} className="cursor-pointer">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border rounded-lg bg-card">
                <h3 className="text-2xl font-bold font-headline">No Upcoming Events</h3>
                <p className="text-muted-foreground mt-2">Check back soon for new events!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-8">
            {loading ? (
                <EventSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedEvent && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Register for {selectedEvent.title}</DialogTitle>
                </DialogHeader>
                <EventRegistrationForm event={selectedEvent} onSuccess={() => setIsModalOpen(false)} />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
