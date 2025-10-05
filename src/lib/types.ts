
export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type SocialLink = {
  name: 'GitHub' | 'Twitter' | 'LinkedIn' | 'Instagram' | 'Discord';
  href: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: 'Lead' | 'Co-Lead' | 'Technical Team' | 'Management Team' | 'Design Team' | 'Core Team';
  position: string;
  branch: string;
  year: string;
  photo: string; // Can be an ID from placeholder-images or a data URI
  bio: string;
  socials: SocialLink[];
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  imageUrl: string;
  type: 'Workshop' | 'Hackathon' | 'Seminar' | 'Study Jam' | 'Tech Talk';
  status: 'Upcoming' | 'Past' | 'Continue';
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: 'Android' | 'Web' | 'Cloud' | 'AI/ML' | 'Flutter' | 'DSA';
  link: string;
  type: 'Video' | 'Article' | 'Course' | 'Documentation';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LeaderboardEntry = {
  rank: number;
  student: {
    name: string;
    avatar: string;
  };
  totalPoints: number;
  skillBadges: number;
  quests: number;
  genAIGames: number;
  profileId: string;
};
