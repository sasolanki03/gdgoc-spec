
'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useToast } from '@/hooks/use-toast';
import type { LeaderboardEntry } from '@/lib/types';
import { scrapeAndProcessProfiles } from '@/ai/flows/scrape-leaderboard-flow';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters.'),
  profileId: z.string().url("Must be a valid Google Cloud Skills Boost profile URL."),
});

type FormValues = z.infer<typeof formSchema>;

interface LeaderboardEntryFormProps {
  entry?: LeaderboardEntry | null;
  onSuccess: (data: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
}

export function LeaderboardEntryForm({ entry, onSuccess }: LeaderboardEntryFormProps) {
  const { toast } = useToast();
  const [isScraping, setIsScraping] = useState(false);

  const defaultValues = {
    studentName: entry?.student.name || '',
    profileId: entry?.profileId || '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    setIsScraping(true);
    toast({
        title: 'Scraping Profile...',
        description: 'Fetching the latest data from the Skills Boost profile.',
    });

    try {
      const results = await scrapeAndProcessProfiles([{
        studentName: values.studentName,
        profileId: values.profileId
      }]);

      const scrapedData = results[0];

      if (!scrapedData) {
        throw new Error("Could not scrape the profile. Please check the URL and try again.");
      }

      onSuccess(scrapedData);
      form.reset();

    } catch (error: any) {
      console.error("Error processing form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not process the form."
      })
    } finally {
        setIsScraping(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">

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
            name="profileId"
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
        
        <Button type="submit" className="w-full" disabled={isScraping || !form.formState.isValid}>
          {isScraping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isScraping ? 'Fetching Data...' : (entry ? 'Update and Rescrape' : 'Scrape and Add Entry')}
        </Button>
      </form>
    </Form>
  );
}
