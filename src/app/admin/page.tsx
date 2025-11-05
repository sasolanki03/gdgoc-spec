
'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLogo } from '@/components/icons/google-logo';
import { useToast } from '@/hooks/use-toast';
import { AnimatedGdgLogo } from '@/components/shared/animated-gdg-logo';
import { Separator } from '@/components/ui/separator';
import { AdminLoginForm } from '@/components/forms/admin-login-form';
import type { AdminAuthCredentials } from '@/lib/types';


export default function AdminLoginPage() {
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isProcessingAuth, setIsProcessingAuth] = useState(false);

    useEffect(() => {
        if (!isUserLoading && user) {
          router.push('/admin/dashboard');
        }
    }, [user, isUserLoading, router]);

    // This effect handles the result of a Google sign-in redirect
    useEffect(() => {
        if (auth && !user && !isUserLoading && !isProcessingAuth) {
            getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        // User has just signed in via redirect.
                        setIsProcessingAuth(true); // Prevent re-triggering while auth state updates
                        toast({ title: 'Signed in successfully!', description: 'Redirecting to dashboard...' });
                    }
                })
                .catch((error) => {
                    console.error("Error with redirect result:", error);
                    toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
                    setIsProcessingAuth(false);
                });
        }
    }, [auth, user, isUserLoading, toast, isProcessingAuth]);

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsProcessingAuth(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithRedirect(auth, provider);
            // After redirect, the effect handling getRedirectResult will take over.
        } catch (error: any) {
            console.error("Google sign-in error:", error);
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
            setIsProcessingAuth(false);
        }
    };

    const handleEmailAuth = async (credentials: AdminAuthCredentials, action: 'login' | 'register') => {
        if (!auth) return;
        setIsProcessingAuth(true);

        try {
            if(action === 'login') {
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            } else {
                await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            }
            // onAuthStateChanged will trigger the user state update, and the first useEffect will handle the redirect.
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: `${action === 'login' ? 'Login' : 'Registration'} Failed`,
                description: error.code === 'auth/invalid-credential' ? 'Invalid email or password.' : (error.message || 'An unexpected error occurred.'),
            })
            setIsProcessingAuth(false);
        }
    }
    
    // While the useUser hook is loading OR we are actively processing an auth action, show a loading spinner.
    if (isUserLoading || isProcessingAuth) {
        return (
             <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
                 <div className="flex flex-col items-center gap-2">
                    <AnimatedGdgLogo />
                    <p className="text-muted-foreground">Signing in...</p>
                 </div>
             </div>
        );
    }
    
    // If not loading and no user, show the login form.
    // If there is a user, the useEffect will have already started the redirect, so we can return null.
    if (user) {
        return null;
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>Sign in to manage the GDGoC SPEC website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <AdminLoginForm onSubmit={handleEmailAuth} isSubmitting={isProcessingAuth} />

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
            
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isProcessingAuth}>
                <GoogleLogo className="mr-2 h-5 w-5" />
                Google
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
