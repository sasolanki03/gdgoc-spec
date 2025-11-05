
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
} from 'lucide-react';
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
import { SheetTitle } from '@/components/ui/sheet';

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
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
                        <SidebarMenuButton asChild tooltip="Settings">
                            <Link href="#">
                                <Settings />
                                <span>Settings</span>
                            </Link>
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
                            <User />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin">Logout</Link>
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
