
'use client';

import { useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { PageHeader } from '@/components/shared/page-header';
import { TeamMemberBadge } from '@/components/shared/team-member-badge';
import type { TeamMember } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const teamOrder: TeamMember['role'][] = ['Lead', 'Co-Lead', 'Faculty Advisor', 'Technical Team', 'Event Management Team', 'Community & Outreach Team', 'Social Media & Designing Team', 'Organizer', 'Core Team'];

const TeamSkeleton = () => (
    <div className="space-y-16">
        {teamOrder.map((role) => (
            <section key={role}>
                <Skeleton className="h-9 w-48 mx-auto mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="text-center">
                             <Skeleton className="h-64 w-full rounded-lg" />
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
    return query(collection(firestore, 'team_members'), orderBy('order', 'asc'));
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
      <div className="py-10 md:py-12 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-5 md:px-20">
            {loading ? (
                <TeamSkeleton />
            ) : (
                <div className="space-y-16">
                    {teamOrder.map((role) => (
                        groupedTeams[role] && groupedTeams[role].length > 0 && (
                        <section key={role}>
                            <h2 className="text-3xl font-bold text-center mb-12 font-headline text-gray-800">
                            {role}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20 justify-items-center">
                            {groupedTeams[role].map((member) => (
                                <TeamMemberBadge key={member.id} member={member} />
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
