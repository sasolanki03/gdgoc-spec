'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addDoc, collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { TeamMember } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from 'lucide-react';


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  position: z.string().min(2, 'Position is required.'),
  role: z.enum(['Lead', 'Co-Lead', 'Technical Team', 'Management Team', 'Design Team', 'Core Team']),
  branch: z.string().min(1, 'Please select a branch.'),
  year: z.string().min(1, 'Please select a year.'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.'),
  photo: z.any()
    .refine((files) => files?.[0], "Photo is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

interface AddTeamMemberFormProps {
  onSuccess: () => void;
}

export function AddTeamMemberForm({ onSuccess }: AddTeamMemberFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      position: '',
      role: 'Core Team',
      branch: undefined,
      year: undefined,
      bio: '',
      photo: undefined,
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.trigger('photo');
    } else {
        setPhotoPreview(null);
    }
  };


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) {
        toast({ variant: "destructive", title: "Error", description: "Firestore is not initialized." });
        return;
    }
    const file = values.photo[0];
    
    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const photoDataUrl = await readFileAsDataURL(file);
      
      const newMemberData: Omit<TeamMember, 'id'> = {
          ...values,
          photo: photoDataUrl,
          socials: [], // Initialize with empty socials
      };

      await addDoc(collection(firestore, 'team'), newMemberData);
      
      toast({
        title: 'Member Added!',
        description: `${values.name} has been added to the team.`,
      });
      onSuccess();
      form.reset();
      setPhotoPreview(null);

    } catch (error: any) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Error Adding Member",
        description: error.message,
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">

        <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Photo</FormLabel>
                <div className='flex items-center gap-4'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage src={photoPreview || undefined} alt="Photo preview" />
                        <AvatarFallback>
                            <User className='h-10 w-10 text-muted-foreground' />
                        </AvatarFallback>
                    </Avatar>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                handlePhotoChange(e);
                            }}
                        />
                    </FormControl>
                </div>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                    <Input placeholder="Web Lead" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Co-Lead">Co-Lead</SelectItem>
                  <SelectItem value="Technical Team">Technical Team</SelectItem>
                  <SelectItem value="Management Team">Management Team</SelectItem>
                  <SelectItem value="Design Team">Design Team</SelectItem>
                  <SelectItem value="Core Team">Core Team</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a year" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="First Year">1st Year</SelectItem>
                        <SelectItem value="Second Year">2nd Year</SelectItem>
                        <SelectItem value="Third Year">3rd Year</SelectItem>
                        <SelectItem value="Final Year">Final Year</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="A short bio..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || !form.formState.isValid}>
            {form.formState.isSubmitting ? 'Adding...' : 'Add Member'}
        </Button>

      </form>
    </Form>
  );
}
