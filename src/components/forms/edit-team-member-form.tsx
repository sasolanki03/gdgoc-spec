
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
  role: z.enum(['Lead', 'Co-Lead', 'Faculty Advisor', 'Technical Team', 'Event Management Team', 'Social Media & Designing Team', 'Community & Outreach Team', 'Core Team', 'Organizer']),
  branch: z.string().optional(),
  year: z.string().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters.'),
  order: z.coerce.number().int().min(0, 'Order must be a positive number.'),
  photo: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
}).refine(data => data.role === 'Faculty Advisor' || (data.branch && data.branch.length > 0), {
    message: 'Please select a branch.',
    path: ['branch'],
}).refine(data => data.role === 'Faculty Advisor' || (data.year && data.year.length > 0), {
    message: 'Please select a year.',
    path: ['year'],
});


interface EditTeamMemberFormProps {
  member: TeamMember;
  onSuccess: (id: string, data: Partial<Omit<TeamMember, 'id' | 'socials'>>) => Promise<void>;
}

export function EditTeamMemberForm({ member, onSuccess }: EditTeamMemberFormProps) {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(member.photo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: member.name,
      position: member.position,
      role: member.role,
      branch: member.branch,
      year: member.year,
      bio: member.bio,
      order: member.order || 0,
      photo: undefined,
    },
  });

  const selectedRole = form.watch('role');

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.trigger('photo');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const file = values.photo?.[0];

    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      let photoDataUrl: string | undefined = undefined;
      if (file) {
        photoDataUrl = await readFileAsDataURL(file);
      }

      const updatedMemberData: Partial<Omit<TeamMember, 'id' | 'socials'>> = {
        ...values,
        branch: values.role === 'Faculty Advisor' ? '' : values.branch,
        year: values.role === 'Faculty Advisor' ? '' : values.year,
        photo: photoDataUrl || member.photo,
      };

      await onSuccess(member.id, updatedMemberData);

    } catch (error) {
      console.error("Error processing form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process the form."
      });
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
                        <AvatarImage src={photoPreview || undefined} alt={member.name} />
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
        
        <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="Faculty Advisor">Faculty Advisor</SelectItem>
                    <SelectItem value="Technical Team">Technical Team</SelectItem>
                    <SelectItem value="Event Management Team">Event Management Team</SelectItem>
                    <SelectItem value="Social Media & Designing Team">Social Media & Designing Team</SelectItem>
                    <SelectItem value="Community & Outreach Team">Community & Outreach Team</SelectItem>
                    <SelectItem value="Organizer">Organizer</SelectItem>
                    <SelectItem value="Core Team">Core Team</SelectItem>
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

        {selectedRole !== 'Faculty Advisor' && (
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
                            <SelectItem value="Food Engineering & technology">Food Engineering & technology</SelectItem>
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
        )}

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
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
    
