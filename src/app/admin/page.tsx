'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleLogo } from '@/components/icons/google-logo';
import { useToast } from '@/hooks/use-toast';
import { AnimatedGdgLogo } from '@/components/shared/animated-gdg-logo';

export default function AdminLoginPage() {
    const auth = useAuth();
    const { user, loading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isSigningIn, setIsSigningIn] = useState(true); // Start as true to handle redirect

    useEffect(() => {
        if (!loading && user) {
          router.push('/admin/dashboard');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const handleRedirectResult = async () => {
            if (!auth) return;
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    // User signed in or already signed in.
                    // The useUser hook will handle the redirect to the dashboard.
                    toast({
                        title: 'Login Successful!',
                        description: 'Redirecting to dashboard...',
                    });
                } else {
                    // No redirect result, so the user is not signing in.
                    setIsSigningIn(false);
                }
            } catch (error: any) {
                console.error("Authentication Error:", error);
                toast({
                    variant: 'destructive',
                    title: 'Authentication Failed',
                    description: error.message || 'An error occurred during sign-in.',
                });
                setIsSigningIn(false);
            }
        }
        handleRedirectResult();
    }, [auth, toast, router]);

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsSigningIn(true);
        const provider = new GoogleAuthProvider();
        // It's safe to call this even if the user is already being redirected.
        // Firebase handles this gracefully.
        await signInWithRedirect(auth, provider);
    };
    
    if (loading || isSigningIn || user) {
        return (
             <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
                <AnimatedGdgLogo />
             </div>
        );
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>Sign in to manage the GDGoC SPEC website.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn}>
                <GoogleLogo className="mr-2 h-5 w-5" />
                {isSigningIn ? 'Redirecting...' : 'Sign in with Google'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
