
import Image from 'next/image';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import type { TeamMember, SocialLink } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeamMemberCardProps {
  member: TeamMember;
}

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


const iconComponents: Record<SocialLink['name'], React.ElementType> = {
  GitHub: Github,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Discord: DiscordIcon,
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {

  return (
    <Card className="group relative overflow-hidden text-center">
      <div className="relative aspect-square">
        <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white font-headline">{member.name}</h3>
          <p className="text-sm text-primary">{member.position}</p>
        </div>
      </div>
      <div className="absolute inset-0 flex -translate-y-full flex-col items-center justify-center bg-background/95 p-6 text-center opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-xl font-bold font-headline">{member.name}</h3>
        <p className="text-primary">{member.position}</p>
        <p className="mt-4 flex-grow text-sm text-muted-foreground">{member.bio}</p>
        {member.socials && member.socials.length > 0 && (
          <div className="mt-4 flex items-center space-x-2">
            {member.socials.map((social) => {
              const Icon = iconComponents[social.name];
              return (
                <Button key={social.name} variant="ghost" size="icon" asChild>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
