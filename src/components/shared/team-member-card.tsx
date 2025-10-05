import Image from 'next/image';
import { Github, Twitter, Linkedin, Instagram, Discord } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { TeamMember, SocialLink } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeamMemberCardProps {
  member: TeamMember;
}

const iconComponents: Record<SocialLink['name'], React.ElementType> = {
  GitHub: Github,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Discord: Discord,
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const image = PlaceHolderImages.find(img => img.id === member.photo);

  return (
    <Card className="group relative overflow-hidden text-center">
      <div className="relative aspect-square">
        {image && (
          <Image
            src={image.imageUrl}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={image.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white font-headline">{member.name}</h3>
          <p className="text-sm text-primary">{member.position}</p>
        </div>
      </div>
      <div className="absolute inset-0 flex translate-y-full flex-col items-center justify-center bg-background/95 p-6 text-center transition-transform duration-500 ease-in-out group-hover:translate-y-0">
        <h3 className="text-xl font-bold font-headline">{member.name}</h3>
        <p className="text-primary">{member.position}</p>
        <p className="mt-4 flex-grow text-sm text-muted-foreground">{member.bio}</p>
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
      </div>
    </Card>
  );
}
