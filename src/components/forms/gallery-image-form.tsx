
'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GalleryImage } from '@/lib/types';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    altText: z.string().min(5, 'Alt text must be at least 5 characters.'),
    order: z.coerce.number().int().min(0, 'Order must be a positive number.'),
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

interface GalleryImageFormProps {
  image: GalleryImage | null;
  onSuccess: (data: Omit<GalleryImage, 'id'>) => void;
}

export function GalleryImageForm({ image, onSuccess }: GalleryImageFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(image?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
        altText: image?.altText || '',
        order: image?.order || 0,
        imageUrl: image?.imageUrl || undefined,
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
    setIsSubmitting(true);
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
        let imageDataUrl = typeof values.imageUrl === 'string' ? values.imageUrl : image?.imageUrl || '';
        if (file) {
            imageDataUrl = await readFileAsDataURL(file);
        }
        
        if (!imageDataUrl) {
            toast({ variant: "destructive", title: "Error", description: "Image is required."});
            setIsSubmitting(false);
            return;
        }

        const imageData = {
            ...values,
            imageUrl: imageDataUrl,
        };

        onSuccess(imageData);
        form.reset();
        setImagePreview(null);
    } catch (error) {
        console.error("Error processing file:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not process the image file." });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              {imagePreview ? (
                  <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                      <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                  </div>
              ) : (
                  <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
              )}
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
          name="altText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternative Text</FormLabel>
              <FormControl>
                <Textarea placeholder="A descriptive caption for the image..." {...field} />
              </FormControl>
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
        
        <Button type="submit" className="w-full" disabled={isSubmitting || !form.formState.isValid}>
          {isSubmitting ? 'Saving...' : (image ? 'Save Changes' : 'Add Image')}
        </Button>
      </form>
    </Form>
  );
}
