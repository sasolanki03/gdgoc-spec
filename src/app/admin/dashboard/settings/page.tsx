
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Upload, KeyRound, Instagram, Linkedin, Twitter, Github } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const socialLinkSchema = z.object({
  name: z.enum(['Instagram', 'LinkedIn', 'Twitter', 'GitHub', 'Discord']),
  href: z.string().url('Please enter a valid URL.').or(z.literal('')),
});

const settingsSchema = z.object({
  logo: z.any().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const socialIcons = {
    Instagram: Instagram,
    LinkedIn: Linkedin,
    Twitter: Twitter,
    GitHub: Github,
    Discord: () => (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Discord</title><path d="M20.317,4.3698a19.7913,19.7913,0,0,0-4.8852-1.5152.0741.0741,0,0,0-.0785.0371A12.111,12.111,0,0,0,12,4.7222a12.0837,12.0837,0,0,0-3.3533-1.83.0741.0741,0,0,0-.0785-.0371,19.7363,19.7363,0,0,0-4.8852,1.5152.069.069,0,0,0-.0321.0252.0759.0759,0,0,0-.01.0741,18.9666,18.9666,0,0,0-2.17,10.0445.0741.0741,0,0,0,.03.066,18.01,18.01,0,0,0,4.9158,2.9461.0741.0741,0,0,0,.0883-.0171,13.821,13.821,0,0,0,1.385-2.0084.0741.0741,0,0,0-.0443-.1043,10.4578,10.4578,0,0,1-1.425-1.1448.0741.0741,0,0,0-.0962-.0171,12.0034,12.0034,0,0,0-2.31.8448.0741.0741,0,0,0-.02,0,14.0414,14.0414,0,0,0-1.5226-1.59.0741.0741,0,0,0-.01-.0171,13.001,13.001,0,0,1,1.5492,0,.0741.0741,0,0,0,.0252,0,12.0837,12.0837,0,0,0,2.3364-.8448.0741.0741,0,0,0-.0962.0171,10.4578,10.4578,0,0,1-1.425,1.1448.0741.0741,0,0,0-.0443.1043,13.821,13.821,0,0,0,1.385,2.0084.0741.0741,0,0,0,.0883.0171,18.01,18.01,0,0,0,4.9158-2.9461.0741.0741,0,0,0,.03-.066,18.9666,18.9666,0,0,0-2.17-10.0445.0759.0759,0,0,0-.01-.0741A.069.069,0,0,0,20.317,4.3698ZM8.02,15.3312a2.4922,2.4922,0,0,1-2.4922-2.4922,2.4922,2.4922,0,0,1,2.4922-2.4922,2.4922,2.4922,0,0,1,0,4.9844Zm7.96,0a2.4922,2.4922,0,0,1-2.4922-2.4922,2.4922,2.4922,0,0,1,2.4922-2.4922,2.4922,2.4922,0,0,1,0,4.9844Z" /></svg>
    ),
};


export default function AdminSettingsPage() {
    const firestore = useFirestore();
    const auth = useAuth();
    const { user: adminUser } = useUser();
    const { toast } = useToast();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'site') : null, [firestore]);
    const { data: settingsData, isLoading } = useDoc<{logoUrl: string, socialLinks: z.infer<typeof socialLinkSchema>[]}>(settingsRef);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        mode: 'onChange',
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "socialLinks",
    });

    useEffect(() => {
        if (settingsData) {
            if (settingsData.logoUrl) {
                setLogoPreview(settingsData.logoUrl);
            }
            if (settingsData.socialLinks) {
                form.setValue('socialLinks', settingsData.socialLinks);
            } else {
                 form.setValue('socialLinks', [
                    { name: 'Instagram', href: '' },
                    { name: 'LinkedIn', href: '' },
                    { name: 'Twitter', href: '' },
                    { name: 'GitHub', href: '' },
                    { name: 'Discord', href: '' },
                 ]);
            }
        }
    }, [settingsData, form]);

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
        
        try {
            const currentData = settingsData || {};
            let newLogoUrl = currentData.logoUrl;

            const logoFile = values.logo?.[0];
            if (logoFile) {
                const reader = new FileReader();
                newLogoUrl = await new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(logoFile);
                });
            }

            await setDoc(doc(firestore, 'settings', 'site'), {
                ...currentData,
                logoUrl: newLogoUrl,
                socialLinks: values.socialLinks,
            }, { merge: true });

            toast({
                title: 'Settings Updated',
                description: 'Your new settings have been saved successfully.',
            });

        } catch (e: any) {
            console.error("Error saving settings:", e);
            toast({
                variant: 'destructive',
                title: 'Error Saving Settings',
                description: e.message,
            });
        } finally {
            setIsSubmitting(false);
        }
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>Manage your website's logo and social media presence.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                                    accept="image/*"
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
                        <Separator />
                        <div>
                            <h3 className="text-lg font-medium">Social Media Links</h3>
                            <div className="space-y-4 mt-4">
                                {fields.map((field, index) => {
                                    const Icon = socialIcons[field.name];
                                    return (
                                        <FormField
                                            key={field.id}
                                            control={form.control}
                                            name={`socialLinks.${index}.href`}
                                            render={({ field: inputField }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Icon />
                                                        {field.name}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={`https://${field.name.toLowerCase()}.com/...`} {...inputField} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    );
                                })}
                            </div>
                        </div>
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
                                type="button"
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

                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                    {isSubmitting ? 'Saving...' : 'Save All Settings'}
                </Button>
            </form>
        </Form>
    );
}
