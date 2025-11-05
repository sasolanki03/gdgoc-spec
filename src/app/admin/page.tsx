
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
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [isSigningIn, setIsSigningIn] = useState(true); // Start as true to handle redirect

    useEffect(() => {
        if (!isUserLoading && user) {
          router.push('/admin/dashboard');
        } else if (!isUserLoading && !user) {
          // If there's no user and we are not loading, the user needs to sign in.
          // We check for redirect results, and if there are none, we can show the page.
          getRedirectResult(auth).then((result) => {
            if (!result) {
              setIsSigningIn(false);
            }
          }).catch(error => {
            console.error("Error checking redirect result:", error);
            setIsSigningIn(false); // Show login page even if redirect check fails
          });
        }
    }, [user, isUserLoading, router, auth]);

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsSigningIn(true);
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
    };
    
    // Show a loading spinner while checking auth state or if a user is found (and we're about to redirect)
    if (isUserLoading || isSigningIn || user) {
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
