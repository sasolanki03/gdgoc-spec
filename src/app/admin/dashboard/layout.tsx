
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
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase/auth/use-user';


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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const auth = useAuth();
  
  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    // The AuthGuard will handle the redirect.
  };

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
