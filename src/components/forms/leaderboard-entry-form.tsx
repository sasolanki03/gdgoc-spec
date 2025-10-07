
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
import { useToast } from '@/hooks/use-toast';
import type { LeaderboardEntry } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters.'),
  studentAvatar: z.string().min(1, "Avatar ID is required (e.g., 'leader-1')."),
  profileId: z.string().url("Must be a valid URL.").or(z.literal("#")),
  totalPoints: z.coerce.number().min(0, "Points must be a positive number."),
  skillBadges: z.coerce.number().min(0, "Must be a positive number."),
  quests: z.coerce.number().min(0, "Must be a positive number."),
  genAIGames: z.coerce.number().min(0, "Must be a positive number."),
});

type FormValues = z.infer<typeof formSchema>;

interface LeaderboardEntryFormProps {
  entry?: LeaderboardEntry | null;
  onSuccess: (data: Omit<LeaderboardEntry, 'id' | 'rank'>) => void;
}

export function LeaderboardEntryForm({ entry, onSuccess }: LeaderboardEntryFormProps) {
  const { toast } = useToast();

  const defaultValues = {
    studentName: entry?.student.name || '',
    studentAvatar: entry?.student.avatar || '',
    profileId: entry?.profileId || '',
    totalPoints: entry?.totalPoints || 0,
    skillBadges: entry?.skillBadges || 0,
    quests: entry?.quests || 0,
    genAIGames: entry?.genAIGames || 0,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newEntryData: Omit<LeaderboardEntry, 'id' | 'rank'> = {
        student: {
            name: values.studentName,
            avatar: values.studentAvatar,
        },
        profileId: values.profileId,
        totalPoints: values.totalPoints,
        skillBadges: values.skillBadges,
        quests: values.quests,
        genAIGames: values.genAIGames,
      };

      onSuccess(newEntryData);
      form.reset();

    } catch (error) {
      console.error("Error processing form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process the form."
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">

        <div className="grid grid-cols-2 gap-4">
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
                name="studentAvatar"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Avatar ID</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an avatar" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {Array.from({ length: 15 }, (_, i) => `leader-${i + 1}`).map(avatarId => (
                             <SelectItem key={avatarId} value={avatarId}>{avatarId}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="profileId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Skills Boost Profile URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://..." {...field} />
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

        <div className="grid grid-cols-3 gap-4">
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
        </div>
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
          {form.formState.isSubmitting ? 'Saving...' : (entry ? 'Save Changes' : 'Add Entry')}
        </Button>
      </form>
    </Form>
  );
}
