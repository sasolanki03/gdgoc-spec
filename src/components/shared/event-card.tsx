
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

import type { Event as EventType } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: EventType;
}

export function EventCard({ event }: EventCardProps) {
    const isPlaceholder = !event.imageUrl.startsWith('data:');
    const image = isPlaceholder ? PlaceHolderImages.find(img => img.id === event.imageUrl) : null;
    const imageUrl = image ? image.imageUrl : event.imageUrl;

    const getBadgeVariant = (status: EventType['status']): "default" | "secondary" | "destructive" | "outline" => {
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

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-transform transform hover:-translate-y-2 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
            <Image
                src={imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                data-ai-hint={image?.imageHint || 'event banner'}
            />
        </div>
        <div className="p-6 pb-2">
            <Badge 
                variant={getBadgeVariant(event.status)} 
                className={cn(
                    'absolute top-4 right-4',
                    {
                        'bg-google-green hover:bg-google-green/90 text-white': event.status === 'Upcoming',
                        'bg-google-yellow hover:bg-google-yellow/90 text-black': event.status === 'Continue',
                    }
                )}
            >
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
            <span>{event.date ? format(event.date.toDate(), 'PP') : ''} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.venue}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {event.status === 'Upcoming' || event.status === 'Continue' ? (
          <Button className="w-full bg-primary hover:bg-primary/90">Register Now</Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>View Gallery</Button>
        )}
      </CardFooter>
    </Card>
  );
}
