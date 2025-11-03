
'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore } from '@/firebase';
import { PageHeader } from '@/components/shared/page-header';
import { TeamMemberCard } from '@/components/shared/team-member-card';
import type { TeamMember } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const teamOrder: TeamMember['role'][] = ['Lead', 'Co-Lead', 'Technical Team', 'Management Team', 'Design Team', 'Core Team'];

const TeamSkeleton = () => (
    <div className="space-y-16">
        {teamOrder.map((role) => (
            <section key={role}>
                <Skeleton className="h-9 w-48 mx-auto mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="text-center">
                             <Skeleton className="aspect-square rounded-lg" />
                             <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                             <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                         </div>
                    ))}
                </div>
            </section>
        ))}
    </div>
);


export default function TeamPage() {
  const firestore = useFirestore();

  const teamQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'team');
  }, [firestore]);

  const { data: teamMembers, loading } = useCollection<TeamMember>(teamQuery);

  const groupedTeams = useMemo(() => {
    if (!teamMembers) return {};
    return teamMembers.reduce((acc, member) => {
      const role = member.role;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member);
      return acc;
    }, {} as Record<TeamMember['role'], TeamMember[]>);
  }, [teamMembers]);


  return (
    <div>
      <PageHeader
        title="Meet the Team"
        description="We're a group of passionate students dedicated to building a strong tech community at our college."
      />
      <div className="py-16 md:py-24">
        <div className="container max-w-7xl">
            {loading ? (
                <TeamSkeleton />
            ) : (
                <div className="space-y-16">
                    {teamOrder.map((role) => (
                        groupedTeams[role] && groupedTeams[role].length > 0 && (
                        <section key={role}>
                            <h2 className="text-3xl font-bold text-center mb-8 font-headline">
                            {role}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {groupedTeams[role].map((member) => (
                                <TeamMemberCard key={member.id} member={member} />
                            ))}
                            </div>
                        </section>
                        )
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
