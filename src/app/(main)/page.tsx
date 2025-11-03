
import Image from 'next/image';
import Link from 'next/link';
import { Users, Calendar, Lightbulb, Code, ArrowRight, Mic, Group, Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCounter } from '@/components/shared/stat-counter';
import { events } from '@/lib/placeholder-data';
import { EventCard } from '@/components/shared/event-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { NewsletterForm } from '@/components/forms/newsletter-form';

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

const galleryImageIds = ['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4'];
const galleryImages = PlaceHolderImages.filter(img => galleryImageIds.includes(img.id));

export default function HomePage() {
  const upcomingEvents = events.filter(e => e.status === 'Upcoming').slice(0, 3);
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-8 text-center">
            
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight">
                Google developer Group
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
        <div className="container max-w-screen-xl px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <Users className="h-12 w-12 mx-auto mb-4 text-google-blue" />
              <div className="text-4xl font-bold font-headline">
                +<StatCounter value={500} />
              </div>
              <p className="text-muted-foreground mt-2">Community Members</p>
            </div>
            <div className="p-4">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-google-green" />
              <div className="text-4xl font-bold font-headline">
                +<StatCounter value={50} />
              </div>
              <p className="text-muted-foreground mt-2">Events Hosted</p>
            </div>
            <div className="p-4">
              <Code className="h-12 w-12 mx-auto mb-4 text-google-yellow" />
              <div className="text-4xl font-bold font-headline">
                +<StatCounter value={100} />
              </div>
              <p className="text-muted-foreground mt-2">Projects Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Upcoming Events</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Don't miss our next lineup of exciting workshops, talks, and study jams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
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
      <section className="py-16 md:py-24 bg-card border-y">
        <div className="container max-w-screen-xl px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Join GDG SPEC?</h2>
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
      <section className="py-16 md:py-24">
        <div className="container max-w-screen-xl px-4 md:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">From Our Past Events</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    A glimpse into our vibrant community activities and sessions.
                </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                    <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            data-ai-hint={image.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-16 md:py-24 bg-card border-t">
        <div className="container max-w-4xl text-center">
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
