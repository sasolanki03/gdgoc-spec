import { ArrowUpRight, Video, BookOpen, FileCode } from 'lucide-react';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ResourceCardProps {
  resource: Resource;
}

const typeIcons = {
  Video: Video,
  Article: BookOpen,
  Course: BookOpen,
  Documentation: FileCode,
};

const difficultyColors = {
  Beginner: 'bg-google-green hover:bg-google-green/90',
  Intermediate: 'bg-google-yellow text-black hover:bg-google-yellow/90',
  Advanced: 'bg-google-red hover:bg-google-red/90',
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = typeIcons[resource.type];
  const difficultyColor = difficultyColors[resource.difficulty];

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary">{resource.category}</Badge>
            <Badge className={difficultyColor}>{resource.difficulty}</Badge>
        </div>
        <CardTitle className="font-headline text-lg">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-3 flex-grow pt-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Link href={resource.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 text-primary hover:underline">
          <Icon className="h-4 w-4" />
          <span>View {resource.type}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
