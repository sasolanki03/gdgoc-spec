
'use client';

import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLogo } from '@/components/icons/google-logo';
import { useToast } from '@/hooks/use-toast';
import { AdminLoginForm } from '@/components/forms/admin-login-form';
import type { AdminAuthCredentials } from '@/lib/types';


export default function AdminLoginPage() {
    const auth = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // This effect handles the result of a Google sign-in redirect
    useEffect(() => {
        if (auth) {
            getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        // User has just signed in via redirect.
                        toast({ title: 'Signed in successfully!', description: 'Welcome to the dashboard.' });
                    }
                })
                .catch((error) => {
                    console.error("Error with redirect result:", error);
                    toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
                });
        }
    }, [auth, toast]);

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithRedirect(auth, provider);
            // After redirect, the effect handling getRedirectResult will take over.
        } catch (error: any) {
            console.error("Google sign-in error:", error);
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
            setIsSubmitting(false);
        }
    };

    const handleEmailAuth = async (credentials: AdminAuthCredentials, action: 'login' | 'register') => {
        if (!auth) return;
        setIsSubmitting(true);

        try {
            if(action === 'login') {
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            } else {
                await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            }
            toast({ title: 'Signed in successfully!', description: 'Welcome to the dashboard.' });
            // onAuthStateChanged will trigger the user state update, and the AuthGuard will handle the redirect.
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: `${action === 'login' ? 'Login' : 'Registration'} Failed`,
                description: error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : (error.message || 'An unexpected error occurred.'),
            })
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>Sign in to manage the GDGoC SPEC website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <AdminLoginForm onSubmit={handleEmailAuth} isSubmitting={isSubmitting} />

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                <GoogleLogo className="mr-2 h-5 w-5" />
                Google
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
