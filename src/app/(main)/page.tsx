
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, Calendar, Lightbulb, Code, ArrowRight, Mic, Group, Award, LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { StatCounter } from '@/components/shared/stat-counter';
import { EventCard } from '@/components/shared/event-card';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import type { Event as EventType, StatItem, GalleryImage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import * as lucideIcons from 'lucide-react';

const whyJoinPoints = [
  {
    icon: Group,
    title: 'Connect with Peers',
    description: 'Network with fellow students who are passionate about technology.',
    color: 'text-google-blue',
  },
  {
    icon: Mic,
    title: 'Expert-Led Workshops',
    description: 'Learn new skills directly from industry experts and Google Developers.',
    color: 'text-google-green',
  },
  {
    icon: Lightbulb,
    title: 'Build Real Projects',
    description: 'Apply your skills to solve real-world problems in hackathons and projects.',
    color: 'text-google-yellow',
  },
  {
    icon: Award,
    title: 'Career Growth',
    description: 'Enhance your resume, and get a head start in your tech career.',
    color: 'text-google-red',
  },
];

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

const GallerySkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
    </div>
)

export default function HomePage() {
  const firestore = useFirestore();

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'events'),
      orderBy('startDate', 'asc'),
    );
  }, [firestore]);

  const statsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'stats'), orderBy('order', 'asc'));
  }, [firestore]);

  const galleryQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'gallery'), orderBy('order', 'asc'), limit(4));
  }, [firestore]);

  const { data: allEvents, loading: loadingEvents } = useCollection<EventType>(eventsQuery);
  const { data: stats, loading: loadingStats } = useCollection<StatItem>(statsQuery);
  const { data: galleryImages, loading: loadingGallery } = useCollection<GalleryImage>(galleryQuery);

  const upcomingEvents = useMemo(() => {
    if (!allEvents) return [];
    return allEvents
      .filter(event => event.status === 'Upcoming' || event.status === 'Continue')
      .slice(0, 3);
  }, [allEvents]);
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-card">
        <div className="container mx-auto px-5 md:px-20 text-center">
            
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight">
                Google Developer Group
            </h1>
            <p className="text-2xl md:text-4xl font-normal text-muted-foreground">on Campus</p>
            <p className="mt-4 text-2xl md:text-3xl font-semibold text-primary">
                Shree Parekh engineering College mahuva
            </p>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                Learn, Connect, Grow
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg bg-primary hover:bg-primary/90">
                    <Link href="/#newsletter">Join Community</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                    <Link href="/events">Upcoming Events</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y">
        <div className="container mx-auto px-5 md:px-20 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {loadingStats ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 space-y-2">
                    <Skeleton className="h-12 w-12 mx-auto rounded-full" />
                    <Skeleton className="h-10 w-24 mx-auto" />
                    <Skeleton className="h-5 w-40 mx-auto" />
                </div>
              ))
            ) : (
                stats?.map((stat) => {
                    const Icon = (lucideIcons as Record<string, LucideIcon>)[stat.icon];
                    return (
                        <div key={stat.id} className="p-4">
                            {Icon && <Icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />}
                            <div className="text-4xl font-bold font-headline">
                                +<StatCounter value={stat.value} />
                            </div>
                            <p className="text-muted-foreground mt-2">{stat.label}</p>
                        </div>
                    )
                })
            )}
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-5 md:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Upcoming Events</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Don't miss our next lineup of exciting workshops, talks, and study jams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingEvents ? (
                <EventSkeleton />
            ) : upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <div className="col-span-full text-center py-16 border rounded-lg bg-card">
                    <h3 className="text-2xl font-bold font-headline">No Upcoming Events</h3>
                    <p className="text-muted-foreground mt-2">Check back soon for new events!</p>
                </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="link" className="text-lg">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-10 md:py-12 bg-card border-y">
        <div className="container mx-auto px-5 md:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Join GDGoC SPEC?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Become part of a thriving community of student developers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyJoinPoints.map((point) => (
              <div key={point.title} className="text-center p-6">
                <div className={`flex items-center justify-center h-16 w-16 rounded-full bg-opacity-10 mx-auto mb-4 ${point.color.replace('text-', 'bg-')}/10`}>
                    <point.icon className={`h-8 w-8 ${point.color}`} />
                </div>
                <h3 className="text-xl font-semibold font-headline">{point.title}</h3>
                <p className="mt-2 text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-5 md:px-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">From Our Past Events</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    A glimpse into our vibrant community activities and sessions.
                </p>
            </div>
            {loadingGallery ? (
                <GallerySkeleton />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {galleryImages?.map((image) => (
                        <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group">
                            <Image
                                src={image.imageUrl}
                                alt={image.altText}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-10 md:py-12 bg-card border-t">
        <div className="container max-w-4xl text-center mx-auto px-5">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Stay in the Loop!</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest updates on events, workshops, and opportunities right in your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
