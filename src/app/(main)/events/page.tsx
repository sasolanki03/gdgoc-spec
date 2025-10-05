
'use client';

import { useState } from 'react';

import { events } from '@/lib/placeholder-data';
import type { Event as EventType } from '@/lib/types';
import { PageHeader } from '@/components/shared/page-header';
import { EventCard } from '@/components/shared/event-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EventRegistrationForm } from '@/components/forms/event-registration-form';

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const upcomingEvents = events.filter(e => e.status === 'Upcoming' || e.status === 'Continue');
  const pastEvents = events.filter(e => e.status === 'Past');

  return (
    <div>
      <PageHeader
        title="Events"
        description="Join our workshops, hackathons, and tech talks. Learn new skills, build cool projects, and connect with the community."
      />
      <div className="container max-w-7xl py-16">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-96 md:mx-auto">
            <TabsTrigger value="upcoming">Upcoming & Ongoing</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-8">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map(event => (
                  <Dialog key={event.id} open={isModalOpen && (event.status === 'Upcoming' || event.status === 'Continue')} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                       <div className="cursor-pointer">
                         <EventCard event={event} />
                       </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Register for {event.title}</DialogTitle>
                      </DialogHeader>
                      <EventRegistrationForm event={event} onSuccess={() => setIsModalOpen(false)} />
                    </DialogContent>
                  </Dialog>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
