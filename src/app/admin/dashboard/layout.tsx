
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
  ImageIcon,
  LogOut,
  ShieldAlert,
  Link2,
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
  SidebarCollapse,
  useSidebar,
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
import { cn } from '@/lib/utils';


const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/dashboard/stats', label: 'Stats', icon: BarChart3 },
    { href: '/admin/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
    { href: '/admin/dashboard/events', label: 'Events', icon: Calendar },
    { href: '/admin/dashboard/team', label: 'Team', icon: Users },
    { href: '/admin/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/admin/dashboard/registrations', label: 'Registrations', icon: FileText },
    { href: '/admin/dashboard/contacts', label: 'Contact Messages', icon: Mail },
    { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar() {
    const { user } = useUser();
    const auth = useAuth();
    const { state, setOpenMobile } = useSidebar();
    
    const handleLogout = async () => {
      if (!auth) return;
      await signOut(auth);
      // The AuthGuard will handle the redirect.
    };

    const handleLinkClick = () => {
        setOpenMobile(false);
    }
  
    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/admin/dashboard" onClick={handleLinkClick} className={cn("flex items-center gap-2 font-semibold text-lg font-headline", state === 'collapsed' && 'justify-center')}>
                    <span className={cn(state === 'expanded' ? 'inline' : 'hidden')}>GDGoC SPEC Admin</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {adminNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild tooltip={item.label}>
                                <Link href={item.href} onClick={handleLinkClick}>
                                    <item.icon />
                                    <span className={cn(state === 'expanded' ? 'inline' : 'hidden')}>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className={cn("flex items-center p-2", state === 'collapsed' ? 'justify-center' : 'justify-between')}>
                    <SidebarCollapse />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                            <LogOut />
                            <span className={cn(state === 'expanded' ? 'inline' : 'hidden')}>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

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
        <AdminSidebar />
        <SidebarInset>
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <SidebarTrigger />
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
