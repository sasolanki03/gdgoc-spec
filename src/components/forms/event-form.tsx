
'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s(AM|PM)$/i, 'Invalid time format (e.g., 10:00 AM)'),
  venue: z.string().min(3, 'Venue is required.'),
  status: z.enum(['Upcoming', 'Past', 'Continue']),
  type: z.enum(['Workshop', 'Hackathon', 'Seminar', 'Study Jam', 'Tech Talk', 'Info Session']),
  imageUrl: z.any()
    .refine((value) => {
        if (typeof value === 'string') return true; // Already a URL/Data URI
        if (!value || value.length === 0) return false; // Must have a file if not string
        return value?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max file size is 4MB.`)
    .refine((value) => {
        if (typeof value === 'string') return true;
        if (!value || value.length === 0) return false;
        return ACCEPTED_IMAGE_TYPES.includes(value?.[0]?.type);
    }, ".jpg, .jpeg, .png and .webp files are accepted.")
});

type FormValues = Omit<z.infer<typeof formSchema>, 'imageUrl'> & {
    imageUrl: string;
};

interface EventFormProps {
  event?: Event;
  onSuccess: (data: Omit<Event, 'id'>) => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(() => {
    if (!event) return null;
    const isPlaceholder = !event.imageUrl.startsWith('data:');
    if (isPlaceholder) {
        const image = PlaceHolderImages.find(img => img.id === event.imageUrl);
        return image ? image.imageUrl : null;
    }
    return event.imageUrl;
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event ? new Date(event.date) : undefined,
      time: event?.time || '',
      venue: event?.venue || '',
      status: event?.status || 'Upcoming',
      type: event?.type || 'Workshop',
      imageUrl: event?.imageUrl || undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const file = Array.isArray(values.imageUrl) ? values.imageUrl[0] : null;

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    try {
        let imageDataUrl = typeof values.imageUrl === 'string' ? values.imageUrl : event?.imageUrl || '';
        if (file) {
            imageDataUrl = await readFileAsDataURL(file);
        }

        const eventData = {
            ...values,
            date: format(values.date, 'yyyy-MM-dd'),
            imageUrl: imageDataUrl,
        };

        onSuccess(eventData);
        form.reset();
        setImagePreview(null);
    } catch (error) {
        console.error("Error processing file:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not process the image file."
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Banner</FormLabel>
                <div className='flex items-center gap-4'>
                    {imagePreview ? (
                        <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                            <Image src={imagePreview} alt="Banner preview" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                        </div>
                    )}
                    
                </div>
                <FormControl>
                    <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                            field.onChange(e.target.files);
                            handleImageChange(e);
                        }}
                    />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Android Study Jam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief but catchy description of the event." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input placeholder="10:00 AM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Auditorium" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Hackathon">Hackathon</SelectItem>
                        <SelectItem value="Seminar">Seminar</SelectItem>
                        <SelectItem value="Study Jam">Study Jam</SelectItem>
                        <SelectItem value="Tech Talk">Tech Talk</SelectItem>
                        <SelectItem value="Info Session">Info Session</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Past">Past</SelectItem>
                        <SelectItem value="Continue">Continue</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
          {form.formState.isSubmitting ? 'Saving...' : (event ? 'Save Changes' : 'Create Event')}
        </Button>
      </form>
    </Form>
  );
}
