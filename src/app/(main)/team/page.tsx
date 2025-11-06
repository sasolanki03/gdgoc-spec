
'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { PageHeader } from '@/components/shared/page-header';
import { TeamMemberCard } from '@/components/shared/team-member-card';
import type { TeamMember } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const teamOrder: TeamMember['role'][] = ['Lead', 'Co-Lead', 'Technical Team', 'Event Management Team', 'Community & Outreach Team', 'Social Media & Designing Team', 'Organizer', 'Core Team'];

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

  const teamQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'teamMembers');
  }, [firestore]);

  const { data: teamMembers, isLoading: loading } = useCollection<TeamMember>(teamQuery);

  const groupedTeams = useMemo(() => {
    if (!teamMembers) return {};
    const grouped = teamMembers.reduce((acc, member) => {
      const role = member.role;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(member);
      return acc;
    }, {} as Record<TeamMember['role'], TeamMember[]>);

    // Sort members within each group by the 'order' property
    for (const role in grouped) {
        grouped[role as TeamMember['role']].sort((a, b) => a.order - b.order);
    }

    return grouped;
  }, [teamMembers]);


  return (
    <div>
      <PageHeader
        title="Meet the Team"
        description="We're a group of passionate students dedicated to building a strong tech community at our college."
      />
      <div className="py-10 md:py-12">
        <div className="container mx-auto px-5 md:px-20">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
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
