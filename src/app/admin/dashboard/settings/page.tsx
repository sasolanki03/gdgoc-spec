
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Upload, KeyRound } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

const settingsSchema = z.object({
  logo: z.any()
    .refine((files) => files?.[0], "A logo file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp, and .svg files are accepted."
    ),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
    const firestore = useFirestore();
    const auth = useAuth();
    const { user: adminUser } = useUser();
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'branding') : null, [firestore]);
    const { data: settingsData, isLoading } = useDoc<{logoUrl: string}>(settingsRef);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (settingsData?.logoUrl) {
            setLogoPreview(settingsData.logoUrl);
        }
    }, [settingsData]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(settingsData?.logoUrl || null);
        }
    };

    const onSubmit = async (values: SettingsFormValues) => {
        if (!firestore) return;
        setIsSubmitting(true);

        const file = values.logo[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            try {
                const logoUrl = reader.result as string;
                await setDoc(doc(firestore, 'settings', 'branding'), { logoUrl });
                toast({
                    title: 'Logo Updated',
                    description: 'Your new logo has been saved successfully.',
                });
            } catch (e: any) {
                console.error("Error saving logo:", e);
                toast({
                    variant: 'destructive',
                    title: 'Error Saving Logo',
                    description: e.message,
                });
            } finally {
                setIsSubmitting(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const handlePasswordReset = async () => {
        if (!auth || !adminUser?.email) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not find user information to send a password reset email.',
            });
            return;
        }

        setIsResettingPassword(true);
        try {
            await sendPasswordResetEmail(auth, adminUser.email);
            toast({
                title: 'Password Reset Email Sent',
                description: `A password reset link has been sent to ${adminUser.email}. Please check your inbox.`,
            });
        } catch (e: any) {
            console.error("Error sending password reset email:", e);
            toast({
                variant: 'destructive',
                title: 'Error Sending Email',
                description: e.message,
            });
        } finally {
            setIsResettingPassword(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Website Settings</CardTitle>
                    <CardDescription>Manage your website's branding and other settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website Logo</FormLabel>
                                        <div className="flex items-center gap-6">
                                            <div className="relative h-20 w-40 rounded-md border flex items-center justify-center bg-muted">
                                                {isLoading ? (
                                                    <Skeleton className="h-full w-full" />
                                                ) : logoPreview ? (
                                                    <Image
                                                        src={logoPreview}
                                                        alt="Logo Preview"
                                                        fill
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.files);
                                                            handleFileChange(e);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage className="mt-2" />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                                {isSubmitting ? 'Saving...' : 'Save Logo'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage settings related to your administrator account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h3 className="font-medium">Password Reset</h3>
                            <p className="text-sm text-muted-foreground">Send a password reset link to your email address.</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handlePasswordReset}
                            disabled={isResettingPassword}
                        >
                            <KeyRound className="mr-2 h-4 w-4" />
                            {isResettingPassword ? 'Sending...' : 'Send Reset Email'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
