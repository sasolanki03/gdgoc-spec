
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { doc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '../ui/skeleton';

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Events', href: '/events' },
  { title: 'Team', href: '/team' },
  { title: 'Leaderboard', href: '/leaderboard' },
  { title: 'Contact', href: '/contact' },
];

function SiteLogo() {
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(() => (firestore ? doc(firestore, 'settings', 'site') : null), [firestore]);
  const { data: settingsData, isLoading } = useDoc<{ logoUrl: string }>(settingsRef);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <Skeleton className="h-10 w-32" />;
  }
  
  if (settingsData?.logoUrl) {
    return (
      <Image 
        src={settingsData.logoUrl} 
        alt="Site Logo"
        width={128}
        height={40}
        className="object-contain h-10 w-auto"
        priority
      />
    );
  }
  
  return <span className="text-xl font-bold sm:inline-block font-headline">GDGoC SPEC</span>;
}

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleJoinClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
        e.preventDefault();
        document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-5 md:px-20 flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
            <SiteLogo />
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-center">
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center text-lg font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button asChild variant="default" className="hidden sm:flex bg-google-blue hover:bg-google-blue/90">
            <a href="/#newsletter" onClick={handleJoinClick}>Join Community</a>
          </Button>
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-2 py-1 text-lg"
                    onClick={handleLinkClick}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
