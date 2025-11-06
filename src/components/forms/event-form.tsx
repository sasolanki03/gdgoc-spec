
'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { Timestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useStorage } from '@/firebase';

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
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  startDate: z.date({ required_error: 'A start date is required.' }),
  endDate: z.date({ required_error: 'An end date is required.' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s(AM|PM)$/i, 'Invalid time format (e.g., 10:00 AM)'),
  venue: z.string().min(3, 'Venue is required.'),
  status: z.enum(['Upcoming', 'Past', 'Continue']),
  type: z.enum(['Workshop', 'Hackathon', 'Seminar', 'Study Jam', 'Tech Talk', 'Info Session']),
  image: z.any().optional(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

interface EventFormProps {
  event?: Event;
  onSuccess: (data: Omit<Event, 'id'>) => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const { toast } = useToast();
  const storage = useStorage();
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      startDate: event ? event.startDate.toDate() : undefined,
      endDate: event ? event.endDate.toDate() : undefined,
      time: event?.time || '',
      venue: event?.venue || '',
      status: event?.status || 'Upcoming',
      type: event?.type || 'Workshop',
      image: undefined,
    },
  });

  const { formState: { isDirty }, trigger } = form;

  useEffect(() => {
    // This effect ensures that if the image is changed, the form is marked as "dirty"
    // which will enable the save button.
    if (imageChanged) {
      trigger();
    }
  }, [imageChanged, trigger]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageChanged(true);
      };
      reader.readAsDataURL(file);
    } else {
      // If a file is cleared, revert to the original event image if it exists
      setImagePreview(event?.imageUrl || null);
      setImageChanged(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!storage) {
        toast({ variant: "destructive", title: "Error", description: "Storage service is not available." });
        return;
    }
    setIsSubmitting(true);
    let finalImageUrl = event?.imageUrl || '';
    const imageFile = values.image?.[0];

    try {
        if (imageFile) { // An image was newly selected
            const validationResult = z.any()
                .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
                .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), ".jpg, .jpeg, .png and .webp files are accepted.")
                .safeParse(imageFile);

            if (!validationResult.success) {
                form.setError('image', { message: validationResult.error.errors[0].message });
                setIsSubmitting(false);
                return;
            }

            const imageStorageRef = storageRef(storage, `event-banners/${Date.now()}-${imageFile.name}`);
            const uploadResult = await uploadBytes(imageStorageRef, imageFile);
            finalImageUrl = await getDownloadURL(uploadResult.ref);
        }

        // Ensure there is an image URL, either the old one or the newly uploaded one.
        if (!finalImageUrl) {
            toast({ variant: 'destructive', title: 'Image Required', description: 'Please select an image for the event.' });
            setIsSubmitting(false);
            return;
        }
        
        const eventData = {
            ...values,
            startDate: Timestamp.fromDate(values.startDate),
            endDate: Timestamp.fromDate(values.endDate),
            imageUrl: finalImageUrl,
        };
        // @ts-ignore
        delete eventData.image;

        onSuccess(eventData as Omit<Event, 'id'>);
        form.reset();
        setImagePreview(null);
        setImageChanged(false);
    } catch (error: any) {
        console.error("Error processing form:", error);
        toast({ variant: "destructive", title: "Error", description: error.message || "Could not save the event." });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="image"
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
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
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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
        </div>
        
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

        <Button type="submit" className="w-full" disabled={isSubmitting || (!isDirty && !imageChanged)}>
          {isSubmitting ? 'Saving...' : (event ? 'Save Changes' : 'Create Event')}
        </Button>
      </form>
    </Form>
  );
}
