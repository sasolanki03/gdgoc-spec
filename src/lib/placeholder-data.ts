
import type { TeamMember, Event, FaqItem, LeaderboardEntry } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

// Function to get image URL from placeholder ID
const getImageUrl = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/400/400';
};


export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Lead',
    position: 'GDG Lead',
    branch: 'Computer Engineering',
    year: 'Final Year',
    photo: getImageUrl('team-lead'),
    bio: 'Passionate about building communities and exploring new technologies. Focussing on Cloud and AI.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '2',
    name: 'Brenda Smith',
    role: 'Co-Lead',
    position: 'GDG Co-Lead',
    branch: 'Information Technology',
    year: 'Third Year',
    photo: getImageUrl('team-co-lead'),
    bio: 'A design enthusiast and frontend developer who loves creating beautiful and intuitive user interfaces.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '3',
    name: 'Charlie Brown',
    role: 'Technical Team',
    position: 'Android Lead',
    branch: 'Computer Engineering',
    year: 'Third Year',
    photo: getImageUrl('team-android-lead'),
    bio: 'Android developer who loves Kotlin and Jetpack Compose. Always excited to build cool apps.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '4',
    name: 'Diana Prince',
    role: 'Technical Team',
    position: 'Web Lead',
    branch: 'Computer Science',
    year: 'Third Year',
    photo: getImageUrl('team-web-lead'),
    bio: 'Full-stack web developer with a knack for React and Next.js. Believes in a fast and accessible web.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '5',
    name: 'Edward Nygma',
    role: 'Technical Team',
    position: 'Cloud Lead',
    branch: 'Information Technology',
    year: 'Second Year',
    photo: getImageUrl('team-cloud-lead'),
    bio: 'Cloud enthusiast exploring the vast possibilities of GCP and Firebase. Loves serverless architecture.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    role: 'Technical Team',
    position: 'ML Lead',
    branch: 'Computer Engineering',
    year: 'Third Year',
    photo: getImageUrl('team-ml-lead'),
    bio: 'AI/ML aficionado who finds joy in data and algorithms. Currently working with TensorFlow and PyTorch.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '7',
    name: 'George Costanza',
    role: 'Design Team',
    position: 'Design Lead',
    branch: 'Mechanical Engineering',
    year: 'Third Year',
    photo: getImageUrl('team-design-lead'),
    bio: 'Creative mind translating ideas into visually stunning designs. Master of Figma and motion graphics.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'Twitter', href: '#' },
    ],
  },
  {
    id: '8',
    name: 'Hannah Montana',
    role: 'Management Team',
    position: 'Marketing Lead',
    branch: 'Information Technology',
    year: 'Second Year',
    photo: getImageUrl('team-marketing-lead'),
    bio: 'The voice of GDG, connecting with the community through social media and outreach.',
    socials: [
      { name: 'LinkedIn', href: '#' },
      { name: 'Instagram', href: '#' },
    ],
  },
];

export const events: Event[] = [
  {
    id: '1',
    title: 'Android Study Jam 2025',
    description: 'Join us for a hands-on study jam to learn the fundamentals of modern Android development with Kotlin and Jetpack Compose.',
    date: '2025-08-15',
    time: '10:00 AM',
    venue: 'Auditorium, Main Building',
    imageUrl: 'event-android-study-jam',
    type: 'Study Jam',
    status: 'Upcoming',
  },
  {
    id: '2',
    title: 'Cloud Study Jam',
    description: 'Dive into Google Cloud Platform with our interactive study session. Get hands-on experience with core cloud services.',
    date: '2025-09-05',
    time: '11:00 AM',
    venue: 'Seminar Hall 1',
    imageUrl: 'event-cloud-study-jam',
    type: 'Study Jam',
    status: 'Upcoming',
  },
  {
    id: '3',
    title: 'Web Development Workshop',
    description: 'A comprehensive workshop on building modern, responsive web applications using React and Firebase.',
    date: '2025-09-20',
    time: '09:30 AM',
    venue: 'Computer Lab 3',
    imageUrl: 'event-web-workshop',
    type: 'Workshop',
    status: 'Upcoming',
  },
  {
    id: '4',
    title: 'Hackathon 2025',
    description: 'The annual 24-hour hackathon is back! Form a team, build a project, and win exciting prizes.',
    date: '2024-04-10',
    time: '06:00 PM',
    venue: 'Main Campus',
    imageUrl: 'event-hackathon',
    type: 'Hackathon',
    status: 'Past',
  },
  {
    id: '5',
    title: 'Flutter Forward',
    description: 'Explore the latest updates in Flutter and learn how to build beautiful, natively compiled applications for mobile, web, and desktop.',
    date: '2024-03-22',
    time: '02:00 PM',
    venue: 'Auditorium',
    imageUrl: 'event-flutter-forward',
    type: 'Tech Talk',
    status: 'Past',
  },
  {
    id: '6',
    title: 'Tech Talk Series: AI Ethics',
    description: 'A thought-provoking discussion on the ethical implications of artificial intelligence with industry experts.',
    date: '2024-02-18',
    time: '04:00 PM',
    venue: 'Online',
    imageUrl: 'event-tech-talk',
    type: 'Seminar',
    status: 'Past',
  },
];


export const faqs: FaqItem[] = [
  {
    question: 'How do I join the GDG on Campus community?',
    answer: 'You can join our community by clicking the "Join Community" button on the homepage and filling out the registration form. You will then be added to our communication channels.'
  },
  {
    question: 'Are the events free to attend?',
    answer: 'Yes, almost all of our events, including workshops, tech talks, and study jams, are completely free for all students of the college.'
  },
  {
    question: 'Do I need to be a Computer Science student to join?',
    answer: 'Not at all! We welcome students from all branches of engineering and beyond. If you have a passion for technology, you are welcome here.'
  },
  {
    question: 'What are the benefits of becoming a member?',
    answer: 'Members get priority access to event registrations, opportunities to participate in exclusive hackathons, networking with peers and industry professionals, and a platform to grow their technical and soft skills.'
  },
  {
    question: 'How can I become a part of the core team?',
    answer: 'We announce recruitment for our core team annually. Keep an eye on our social media channels and your email for notifications about the selection process.'
  }
];

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, student: { name: 'Priya Sharma', avatar: 'leader-1' }, totalPoints: 1250, skillBadges: 15, quests: 5, genAIGames: 2, profileId: '#' },
  { rank: 2, student: { name: 'Rohan Gupta', avatar: 'leader-2' }, totalPoints: 1180, skillBadges: 14, quests: 5, genAIGames: 1, profileId: '#' },
  { rank: 3, student: { name: 'Anjali Mehta', avatar: 'leader-3' }, totalPoints: 1150, skillBadges: 13, quests: 4, genAIGames: 2, profileId: '#' },
  { rank: 4, student: { name: 'Vikram Singh', avatar: 'leader-4' }, totalPoints: 1100, skillBadges: 12, quests: 5, genAIGames: 1, profileId: '#' },
  { rank: 5, student: { name: 'Sameer Khan', avatar: 'leader-5' }, totalPoints: 1050, skillBadges: 11, quests: 4, genAIGames: 1, profileId: '#' },
  { rank: 6, student: { name: 'Neha Reddy', avatar: 'leader-6' }, totalPoints: 1020, skillBadges: 10, quests: 4, genAIGames: 1, profileId: '#' },
  { rank: 7, student: { name: 'Arjun Desai', avatar: 'leader-7' }, totalPoints: 980, skillBadges: 9, quests: 3, genAIGames: 2, profileId: '#' },
  { rank: 8, student: { name: 'Kavita Patel', avatar: 'leader-8' }, totalPoints: 950, skillBadges: 9, quests: 3, genAIGames: 1, profileId: '#' },
  { rank: 9, student: { name: 'Rajesh Kumar', avatar: 'leader-9' }, totalPoints: 910, skillBadges: 8, quests: 3, genAIGames: 1, profileId: '#' },
  { rank: 10, student: { name: 'Sunita Rao', avatar: 'leader-10' }, totalPoints: 880, skillBadges: 8, quests: 2, genAIGames: 1, profileId: '#' },
  { rank: 11, student: { name: 'Amit Verma', avatar: 'leader-11' }, totalPoints: 850, skillBadges: 7, quests: 2, genAIGames: 1, profileId: '#' },
  { rank: 12, student: { name: 'Deepika Iyer', avatar: 'leader-12' }, totalPoints: 820, skillBadges: 7, quests: 2, genAIGames: 0, profileId: '#' },
  { rank: 13, student: { name: 'Manoj Tiwari', avatar: 'leader-13' }, totalPoints: 790, skillBadges: 6, quests: 2, genAIGames: 1, profileId: '#' },
  { rank: 14, student: { name: 'Pooja Agarwal', avatar: 'leader-14' }, totalPoints: 760, skillBadges: 6, quests: 1, genAIGames: 1, profileId: '#' },
  { rank: 15, student: { name: 'Harish Nair', avatar: 'leader-15' }, totalPoints: 730, skillBadges: 5, quests: 1, genAIGames: 1, profileId: '#' },
];
