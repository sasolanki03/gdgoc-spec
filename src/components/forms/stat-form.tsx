
'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import * as lucideIcons from 'lucide-react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StatItem } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  label: z.string().min(2, 'Label must be at least 2 characters.'),
  value: z.coerce.number().int().min(0, 'Value must be a positive number.'),
  icon: z.string().min(1, 'An icon is required.'),
  color: z.string().min(1, 'A color is required (e.g., text-google-blue).'),
  order: z.coerce.number().int().min(0, 'Order must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

const iconNames = Object.keys(lucideIcons).filter(key => /^[A-Z]/.test(key) && key !== 'createLucideIcon' && key !== 'LucideIcon');
const colorOptions = [
    { label: 'Google Blue', value: 'text-google-blue' },
    { label: 'Google Green', value: 'text-google-green' },
    { label: 'Google Yellow', value: 'text-google-yellow' },
    { label: 'Google Red', value: 'text-google-red' },
    { label: 'Primary', value: 'text-primary' },
    { label: 'Accent', value: 'text-accent' },
]

interface StatFormProps {
  stat: StatItem | null;
  onSuccess: (data: Omit<StatItem, 'id'>) => void;
}

export function StatForm({ stat, onSuccess }: StatFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
        label: stat?.label || '',
        value: stat?.value || 0,
        icon: stat?.icon || 'Users',
        color: stat?.color || 'text-google-blue',
        order: stat?.order || 0,
    },
  });

  const onSubmit = (values: FormValues) => {
    onSuccess(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                        <Input placeholder="Community Members" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <ScrollArea className="h-72">
                                {iconNames.map(iconName => (
                                    <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                                ))}
                            </ScrollArea>
                        </SelectContent>
                    </Select>
                    <FormDescription>Select an icon from the Lucide icon library.</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Icon Color</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {colorOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Stat'}
        </Button>
      </form>
    </Form>
  );
}
