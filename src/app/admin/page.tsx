
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
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        if (!loading && user) {
          router.push('/admin/dashboard');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const handleRedirectResult = async () => {
            if (isSigningIn) return; // Prevent loop
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    toast({
                        title: 'Login Successful!',
                        description: 'Redirecting to dashboard...',
                    });
                    // This will trigger the other useEffect to redirect
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
    }, [auth, toast, isSigningIn]);

    const handleGoogleSignIn = async () => {
        setIsSigningIn(true);
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
    };
    
    if (loading || user) {
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
