
'use client';

import React, { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry, Event as EventType } from '@/lib/types';


const formSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters.'),
  profileUrl: z.string().url("Must be a valid Google Cloud Skills Boost profile URL."),
  campaignCompleted: z.boolean().default(false),
  completionTime: z.date().optional(),
  eventId: z.string().min(1, "Please select an event."),
}).refine(data => {
    if (data.campaignCompleted) {
        return !!data.completionTime;
    }
    return true;
}, {
    message: "Completion date is required if campaign is completed.",
    path: ["completionTime"],
});


type FormValues = z.infer<typeof formSchema>;

interface LeaderboardEntryFormProps {
  entry: Omit<LeaderboardEntry, 'rank' | 'avatar'> | null;
  onSuccess: (data: Omit<LeaderboardEntry, 'id' | 'rank' | 'avatar'>) => void;
  defaultEventId?: string;
}

export function LeaderboardEntryForm({ entry, onSuccess, defaultEventId }: LeaderboardEntryFormProps) {
  const firestore = useFirestore();
  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('startDate', 'desc'));
  }, [firestore]);
  const { data: events, loading: loadingEvents } = useCollection<EventType>(eventsQuery);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
        studentName: entry?.studentName || '',
        profileUrl: entry?.profileUrl || '',
        campaignCompleted: entry?.campaignCompleted || false,
        completionTime: entry?.completionTime ? entry.completionTime.toDate() : undefined,
        eventId: entry?.eventId || defaultEventId || undefined,
    },
  });

  const isCampaignCompleted = form.watch('campaignCompleted');

  const onSubmit = async (values: FormValues) => {
    const selectedEvent = events?.find(e => e.id === values.eventId);
    if (!selectedEvent) return;

    const dataToSave = {
        ...values,
        completionTime: values.campaignCompleted && values.completionTime ? Timestamp.fromDate(values.completionTime) : null,
        eventName: selectedEvent.title,
    };
    onSuccess(dataToSave as Omit<LeaderboardEntry, 'id' | 'rank' | 'avatar'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
         <FormField
            control={form.control}
            name="eventId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Event</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingEvents || !!defaultEventId}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an event for the leaderboard" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {loadingEvents && <SelectItem value="loading" disabled>Loading events...</SelectItem>}
                        {events?.map(event => (
                            <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Skills Boost Profile URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://www.cloudskillsboost.google/public_profiles/..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="campaignCompleted"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        Campaign Completed?
                        </FormLabel>
                        <FormDescription>
                        Check this if the student has completed all required activities.
                        </FormDescription>
                    </div>
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="completionTime"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Date of Last Badge Completion</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={!isCampaignCompleted}
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
                        disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <FormDescription>
                    This is used to determine rank. This field is enabled only if the campaign is marked as completed.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Entry'}
        </Button>
      </form>
    </Form>
  );
}
