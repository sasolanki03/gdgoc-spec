
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { doc } from 'firebase/firestore';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { SocialLink } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M20.317,4.3698a19.7913,19.7913,0,0,0-4.8852-1.5152.0741.0741,0,0,0-.0785.0371A12.111,12.111,0,0,0,12,4.7222a12.0837,12.0837,0,0,0-3.3533-1.83.0741.0741,0,0,0-.0785-.0371,19.7363,19.7363,0,0,0-4.8852,1.5152.069.069,0,0,0-.0321.0252.0759.0759,0,0,0-.01.0741,18.9666,18.9666,0,0,0-2.17,10.0445.0741.0741,0,0,0,.03.066,18.01,18.01,0,0,0,4.9158,2.9461.0741.0741,0,0,0,.0883-.0171,13.821,13.821,0,0,0,1.385-2.0084.0741.0741,0,0,0-.0443-.1043,10.4578,10.4578,0,0,1-1.425-1.1448.0741.0741,0,0,0-.0962-.0171,12.0034,12.0034,0,0,0-2.31.8448.0741.0741,0,0,0-.02,0,14.0414,14.0414,0,0,0-1.5226-1.59.0741.0741,0,0,0-.01-.0171,13.001,13.001,0,0,1,1.5492,0,.0741.0741,0,0,0,.0252,0,12.0837,12.0837,0,0,0,2.3364-.8448.0741.0741,0,0,0-.0962.0171,10.4578,10.4578,0,0,1-1.425,1.1448.0741.0741,0,0,0-.0443.1043,13.821,13.821,0,0,0,1.385,2.0084.0741.0741,0,0,0,.0883.0171,18.01,18.01,0,0,0,4.9158-2.9461.0741.0741,0,0,0,.03-.066,18.9666,18.9666,0,0,0-2.17-10.0445.0759.0759,0,0,0-.01-.0741A.069.069,0,0,0,20.317,4.3698ZM8.02,15.3312a2.4922,2.4922,0,0,1-2.4922-2.4922,2.4922,2.4922,0,0,1,2.4922-2.4922,2.4922,2.4922,0,0,1,0,4.9844Zm7.96,0a2.4922,2.4922,0,0,1-2.4922-2.4922,2.4922,2.4922,0,0,1,2.4922-2.4922,2.4922,2.4922,0,0,1,0,4.9844Z" />
    </svg>
);

const iconComponents = {
    Instagram: Instagram,
    LinkedIn: Linkedin,
    Twitter: Twitter,
    GitHub: Github,
    Discord: DiscordIcon,
};

function SiteLogo() {
    const firestore = useFirestore();
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'site') : null, [firestore]);
    const { data: settingsData, isLoading } = useDoc<{logoUrl: string}>(settingsRef);
  
    if (isLoading) {
      return <Skeleton className="h-8 w-28" />;
    }
  
    if (settingsData?.logoUrl) {
      return (
        <Image 
          src={settingsData.logoUrl} 
          alt="Site Logo"
          width={120}
          height={30}
          className="object-contain h-8"
        />
      );
    }
  
    return <span className="text-xl font-bold font-headline">GDGoC SPEC</span>;
}

export function Footer() {
    const firestore = useFirestore();
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'site') : null, [firestore]);
    const { data: settingsData, isLoading } = useDoc<{socialLinks: SocialLink[]}>(settingsRef);

  return (
    <footer className="border-t py-10">
      <div className="container mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center space-x-2">
                <SiteLogo />
            </Link>
            <p className="text-muted-foreground">
              Learn, Connect, Grow with the Google Developer Group on Campus at Shree Parekh Engineering College, Mahuva.
            </p>
          </div>
          <div className="md:justify-self-center">
            <h3 className="mb-4 text-lg font-semibold font-headline">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link href="/team" className="text-muted-foreground hover:text-primary">Team</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div className="md:justify-self-end">
            <h3 className="mb-4 text-lg font-semibold font-headline">Follow Us</h3>
            <div className="flex items-center space-x-2">
              {isLoading ? (
                  [...Array(5)].map((_,i) => <Skeleton key={i} className="h-10 w-10" />)
              ) : (
                settingsData?.socialLinks?.map(link => {
                    const Icon = iconComponents[link.name];
                    return (
                    <Button key={link.name} variant="ghost" size="icon" asChild>
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{link.name}</span>
                        </a>
                    </Button>
                    );
                })
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GDGoC SPEC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
