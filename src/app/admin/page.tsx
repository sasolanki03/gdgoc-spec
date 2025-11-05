
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
    const [isSigningIn, setIsSigningIn] = useState(true);

    useEffect(() => {
        if (!isUserLoading && user) {
          router.push('/admin/dashboard');
        } else if (!isUserLoading && !user) {
          getRedirectResult(auth).then((result) => {
            if (result) {
                // This is the signed-in user
            }
          }).catch(error => {
            console.error("Error checking redirect result:", error);
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
          }).finally(() => {
            setIsSigningIn(false);
          });
        }
    }, [user, isUserLoading, router, auth, toast]);

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsSigningIn(true);
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
    };

    const handleEmailAuth = async (credentials: AdminAuthCredentials, action: 'login' | 'register') => {
        if (!auth) return;
        setIsSigningIn(true);

        try {
            if(action === 'login') {
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            } else {
                await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
            }
            // onAuthStateChanged will handle the redirect to dashboard
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: `${action === 'login' ? 'Login' : 'Registration'} Failed`,
                description: error.message || 'An unexpected error occurred.'
            })
            setIsSigningIn(false); // only stop spinner on error, otherwise wait for redirect
        }
    }
    
    if (isUserLoading || isSigningIn) {
        return (
             <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
                <AnimatedGdgLogo />
             </div>
        );
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>Sign in to manage the GDGoC SPEC website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <AdminLoginForm onSubmit={handleEmailAuth} isSubmitting={isSigningIn} />

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
            
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn}>
                <GoogleLogo className="mr-2 h-5 w-5" />
                Google
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
