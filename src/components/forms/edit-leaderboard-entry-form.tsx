
'use client';

import React from 'react';
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
import type { LeaderboardEntry } from '@/lib/types';

const formSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters.'),
  profileId: z.string().url("Must be a valid Google Cloud Skills Boost profile URL."),
  skillBadges: z.coerce.number().min(0, "Cannot be negative."),
  quests: z.coerce.number().min(0, "Cannot be negative."),
  genAIGames: z.coerce.number().min(0, "Cannot be negative."),
  totalPoints: z.coerce.number().min(0, "Cannot be negative."),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLeaderboardEntryFormProps {
  entry: LeaderboardEntry;
  onSuccess: (id: string, data: Partial<Omit<LeaderboardEntry, 'id' | 'rank'>>) => void;
}

export function EditLeaderboardEntryForm({ entry, onSuccess }: EditLeaderboardEntryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      studentName: entry.student.name,
      profileId: entry.profileId,
      skillBadges: entry.skillBadges,
      quests: entry.quests,
      genAIGames: entry.genAIGames,
      totalPoints: entry.totalPoints,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const updatedData = {
        student: {
            name: values.studentName,
            avatar: entry.student.avatar, // Keep original avatar
        },
        profileId: values.profileId,
        skillBadges: values.skillBadges,
        quests: values.quests,
        genAIGames: values.genAIGames,
        totalPoints: values.totalPoints,
    };
    onSuccess(entry.id, updatedData);
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
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="skillBadges"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Skill Badges</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="quests"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quests</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="genAIGames"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>GenAI Games</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="totalPoints"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Total Points</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}

