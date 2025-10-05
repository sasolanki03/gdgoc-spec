import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';

import type { Event as EventType } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: EventType;
}

export function EventCard({ event }: EventCardProps) {
  const image = PlaceHolderImages.find(img => img.id === event.imageUrl);

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-transform transform hover:-translate-y-2 hover:shadow-xl">
      <CardHeader className="p-0">
        {image && (
          <div className="relative h-48 w-full">
            <Image
              src={image.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        <div className="p-6 pb-2">
            <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'} className={`absolute top-4 right-4 ${event.status === 'Upcoming' ? 'bg-google-green hover:bg-google-green/90' : ''}`}>
                {event.status}
            </Badge>
            <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {event.status === 'Upcoming' ? (
          <Button className="w-full bg-primary hover:bg-primary/90">Register Now</Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>View Gallery</Button>
        )}
      </CardFooter>
    </Card>
  );
}
