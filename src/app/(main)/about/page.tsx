
import Image from 'next/image';
import { Metadata } from 'next';
import { Target, Eye, Activity, Globe, Cloud, BrainCircuit, Bot } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission, vision, and activities of GDGoC SPEC.',
};

const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 12a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" /><path d="M12 4V2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m5.64 17.66-1.41 1.41" /><path d="m18.36 5.64-1.41 1.41" /></svg>
);


const techFocus = [
    { name: 'Android', icon: AndroidIcon, color: 'text-google-green' },
    { name: 'Web', icon: Globe, color: 'text-google-blue' },
    { name: 'Cloud', icon: Cloud, color: 'text-google-yellow' },
    { name: 'AI/ML', icon: BrainCircuit, color: 'text-google-red' },
    { name: 'Flutter', icon: Bot, color: 'text-primary' },
];

export default function AboutPage() {
    const missionImage = PlaceHolderImages.find(img => img.id === 'about-mission');
  return (
    <div>
      <PageHeader
        title="About GDGoC SPEC"
        description="We are a community of student developers at Shree Parekh Engineering College, passionate about Google technologies and building impactful solutions."
      />

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-5 md:px-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="md:w-1/2 space-y-6 max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-bold font-headline">What is GDGoC?</h2>
              <p className="text-muted-foreground text-lg">
                Google Developer Groups (GDGs) are for developers who are interested in Google's developer technology; everything from the Android, Chrome, Drive, and Google Cloud platforms, to product APIs like the Cast API, Maps API, and YouTube API.
              </p>
              <p className="text-muted-foreground text-lg">
                A GDG can take many forms -- from just a few people getting together to watch our latest video, to large gatherings with demos and tech talks, to events like code sprints and hackathons.
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
                {missionImage && (
                    <div className="relative h-80 w-full max-w-lg rounded-lg overflow-hidden">
                        <Image
                            src={missionImage.imageUrl}
                            alt="Our mission"
                            fill
                            className="object-cover"
                            data-ai-hint={missionImage.imageHint}
                        />
                    </div>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-card border-y">
        <div className="container max-w-5xl mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="flex flex-col items-center text-center p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold font-headline mb-2">Our Mission</h3>
                    <p className="text-muted-foreground">To provide a platform for students to learn new skills, connect with like-minded peers, and grow as developers and future leaders in the tech industry.</p>
                </div>
                 <div className="flex flex-col items-center text-center p-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
                        <Eye className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold font-headline mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">To foster a vibrant and inclusive tech culture on campus, empowering students to innovate, collaborate, and make a positive impact on the world.</p>
                </div>
            </div>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">What We Do</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                We organize a variety of events and activities throughout the year.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-lg text-center bg-card shadow-sm">
                <Activity className="h-10 w-10 mx-auto mb-4 text-google-blue"/>
                <h3 className="text-xl font-semibold font-headline">Workshops</h3>
                <p className="mt-2 text-muted-foreground text-sm">Hands-on sessions to learn practical skills.</p>
            </div>
             <div className="p-6 border rounded-lg text-center bg-card shadow-sm">
                <Activity className="h-10 w-10 mx-auto mb-4 text-google-green"/>
                <h3 className="text-xl font-semibold font-headline">Hackathons</h3>
                <p className="mt-2 text-muted-foreground text-sm">Build cool projects and compete for prizes.</p>
            </div>
             <div className="p-6 border rounded-lg text-center bg-card shadow-sm">
                <Activity className="h-10 w-10 mx-auto mb-4 text-google-yellow"/>
                <h3 className="text-xl font-semibold font-headline">Study Jams</h3>
                <p className="mt-2 text-muted-foreground text-sm">Follow a curriculum to master a new technology.</p>
            </div>
             <div className="p-6 border rounded-lg text-center bg-card shadow-sm">
                <Activity className="h-10 w-10 mx-auto mb-4 text-google-red"/>
                <h3 className="text-xl font-semibold font-headline">Tech Talks</h3>
                <p className="mt-2 text-muted-foreground text-sm">Gain insights from industry professionals.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-card border-y">
        <div className="container mx-auto px-5">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Technologies We Focus On</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Our activities revolve around a wide range of Google technologies and developer tools.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {techFocus.map(tech => (
                    <div key={tech.name} className="flex flex-col items-center gap-2">
                        <tech.icon className={`h-12 w-12 ${tech.color}`} />
                        <span className="font-semibold">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}

    