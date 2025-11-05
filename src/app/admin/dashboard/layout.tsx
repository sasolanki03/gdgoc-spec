
'use client';

import Link from 'next/link';
import {
  Home,
  Calendar,
  Users,
  FileText,
  Mail,
  PanelLeft,
  Settings,
  User,
  Trophy,
  BarChart3,
  Image as ImageIcon,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { GoogleLogo } from '@/components/icons/google-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/firebase/auth/use-admin';
import { AnimatedGdgLogo } from '@/components/shared/animated-gdg-logo';
import { useToast } from '@/hooks/use-toast';

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/dashboard/stats', label: 'Stats', icon: BarChart3 },
    { href: '/admin/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/admin/dashboard/events', label: 'Events', icon: Calendar },
    { href: '/admin/dashboard/team', label: 'Team', icon: Users },
    { href: '/admin/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/admin/dashboard/registrations', label: 'Registrations', icon: FileText },
    { href: '/admin/dashboard/contacts', label: 'Contact Messages', icon: Mail },
];

function AdminNotAuthorized() {
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push('/admin');
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-center p-4">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive font-headline">Access Denied</h1>
            <p className="mt-2 text-muted-foreground max-w-sm">
                You are not authorized to view this page. Please contact the site administrator to request access.
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const { isAdmin, loading: isAdminLoading } = useAdmin();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This is the sole guard for the dashboard.
    // If auth state is determined and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    // After signing out, the effect above will trigger the redirect to /admin
  };
  
  const isLoading = isUserLoading || isAdminLoading;

  if (isLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <AnimatedGdgLogo />
                <p className="text-muted-foreground">Verifying access...</p>
            </div>
        </div>
    );
  }

  // After loading, if the user is authenticated but not an admin, show the denial page.
  if (user && !isAdmin) {
    return <AdminNotAuthorized />;
  }
  
  // If there's no user, the useEffect will have already started the redirect.
  // We can render null here to prevent a flash of the dashboard content.
  if (!user) {
      return null;
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="flex items-center justify-between p-2">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <span className="font-semibold text-lg font-headline">GDGoC SPEC Admin</span>
                </Link>
                <SidebarTrigger className="hidden md:flex" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {adminNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild tooltip={item.label}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <SidebarTrigger className="md:hidden" />
                <div className="ml-auto flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="overflow-hidden rounded-full"
                        >
                            <Avatar>
                                {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                                <AvatarFallback>{user?.displayName ? user.displayName.charAt(0) : 'A'}</AvatarFallback>
                            </Avatar>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user?.displayName || 'My Account'}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
