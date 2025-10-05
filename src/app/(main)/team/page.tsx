import { Metadata } from 'next';
import { teamMembers } from '@/lib/placeholder-data';
import { PageHeader } from '@/components/shared/page-header';
import { TeamMemberCard } from '@/components/shared/team-member-card';
import type { TeamMember } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the passionate individuals behind GDG SPEC.',
};

const teamOrder: TeamMember['role'][] = ['Lead', 'Co-Lead', 'Technical Team', 'Management Team', 'Design Team'];

export default function TeamPage() {
  const groupedTeams = teamMembers.reduce((acc, member) => {
    const role = member.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<TeamMember['role'], TeamMember[]>);

  return (
    <div>
      <PageHeader
        title="Meet the Team"
        description="We're a group of passionate students dedicated to building a strong tech community at our college."
      />
      <div className="py-16 md:py-24">
        <div className="container max-w-7xl space-y-16">
          {teamOrder.map((role) => (
            groupedTeams[role] && (
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
      </div>
    </div>
  );
}
