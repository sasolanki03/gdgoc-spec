
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

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
import type { AdminAuthCredentials } from '@/lib/types';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

interface AdminLoginFormProps {
    onSubmit: (credentials: AdminAuthCredentials, action: 'login' | 'register') => void;
    isSubmitting: boolean;
}

export function AdminLoginForm({ onSubmit, isSubmitting }: AdminLoginFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleLogin(values: z.infer<typeof formSchema>) {
    onSubmit(values, 'login');
  }

  function handleRegister(values: z.infer<typeof formSchema>) {
    onSubmit(values, 'register');
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2">
            <Button
                type="button"
                className="w-full"
                onClick={form.handleSubmit(handleLogin)}
                disabled={isSubmitting || !form.formState.isValid}
            >
                Sign In
            </Button>
            <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={form.handleSubmit(handleRegister)}
                disabled={isSubmitting || !form.formState.isValid}
            >
                Create Account
            </Button>
        </div>
      </form>
    </Form>
  );
}
