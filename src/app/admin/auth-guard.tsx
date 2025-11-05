
'use client';

import { useUser, useAdmin } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import AdminLoginPage from './page';
import { AnimatedGdgLogo } from '@/components/shared/animated-gdg-logo';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

function LoadingScreen() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <AnimatedGdgLogo />
                <p className="text-muted-foreground">Verifying access...</p>
            </div>
        </div>
    );
}

function AccessDeniedScreen() {
    const auth = useAuth();
    const handleLogout = async () => {
        if (auth) await signOut(auth);
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-center p-4">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive font-headline">Access Denied</h1>
            <p className="mt-2 text-muted-foreground max-w-sm">
                You are not authorized to view this page. Please contact the site administrator if you believe this is a mistake.
            </p>
            <div className="mt-6 flex gap-4">
                <Button onClick={handleLogout} variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, isUserLoading } = useUser();
    const { isAdmin, loading: isAdminLoading } = useAdmin();
    const pathname = usePathname();
    const router = useRouter();

    const isLoading = isUserLoading || isAdminLoading;

    useEffect(() => {
        // If not loading, user is logged in, but not on a dashboard page, redirect to dashboard.
        if (!isLoading && user && !pathname.startsWith('/admin/dashboard')) {
            router.replace('/admin/dashboard');
        }
    }, [isLoading, user, pathname, router]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    // If there is no authenticated user, show the login page.
    if (!user) {
        return <AdminLoginPage />;
    }

    // If the user is authenticated but not an admin, show the access denied screen.
    if (!isAdmin) {
        return <AccessDeniedScreen />;
    }
    
    // If the user is an authenticated admin, render the dashboard content.
    return <>{children}</>;
}
