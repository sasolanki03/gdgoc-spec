
import type { TeamMember, Event, FaqItem, LeaderboardEntry } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';
import { Timestamp } from 'firebase/firestore';

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

const createMockTimestamp = (dateString: string): Timestamp => {
  return Timestamp.fromDate(new Date(dateString));
};

export const events: Event[] = [
  {
    id: '1',
    title: 'Android Study Jam 2025',
    description: 'Join us for a hands-on study jam to learn the fundamentals of modern Android development with Kotlin and Jetpack Compose.',
    date: createMockTimestamp('2025-08-15'),
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
    date: createMockTimestamp('2025-09-05'),
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
    date: createMockTimestamp('2025-09-20'),
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
    date: createMockTimestamp('2024-04-10'),
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
    date: createMockTimestamp('2024-03-22'),
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
    date: createMockTimestamp('2024-02-18'),
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
  { id: '1', rank: 1, studentName: 'Priya Sharma', avatar: 'leader-1', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-20'), profileUrl: '#' },
  { id: '2', rank: 2, studentName: 'Rohan Gupta', avatar: 'leader-2', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-21'), profileUrl: '#' },
  { id: '3', rank: 3, studentName: 'Anjali Mehta', avatar: 'leader-3', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-22'), profileUrl: '#' },
  { id: '4', rank: 4, studentName: 'Vikram Singh', avatar: 'leader-4', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-23'), profileUrl: '#' },
  { id: '5', rank: 5, studentName: 'Sameer Khan', avatar: 'leader-5', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-24'), profileUrl: '#' },
  { id: '6', rank: 6, studentName: 'Neha Reddy', avatar: 'leader-6', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-25'), profileUrl: '#' },
  { id: '7', rank: 7, studentName: 'Arjun Desai', avatar: 'leader-7', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-26'), profileUrl: '#' },
  { id: '8', rank: 8, studentName: 'Kavita Patel', avatar: 'leader-8', campaignCompleted: true, completionTime: createMockTimestamp('2024-05-27'), profileUrl: '#' },
  { id: '9', rank: 9, studentName: 'Rajesh Kumar', avatar: 'leader-9', campaignCompleted: false, completionTime: createMockTimestamp('2024-05-28'), profileUrl: '#' },
  { id: '10', rank: 10, studentName: 'Sunita Rao', avatar: 'leader-10', campaignCompleted: false, completionTime: createMockTimestamp('2024-05-29'), profileUrl: '#' },
  { id: '11', rank: 11, studentName: 'Amit Verma', avatar: 'leader-11', campaignCompleted: false, completionTime: createMockTimestamp('2024-05-30'), profileUrl: '#' },
  { id: '12', rank: 12, studentName: 'Deepika Iyer', avatar: 'leader-12', campaignCompleted: false, completionTime: createMockTimestamp('2024-06-01'), profileUrl: '#' },
  { id: '13', rank: 13, studentName: 'Manoj Tiwari', avatar: 'leader-13', campaignCompleted: false, completionTime: createMockTimestamp('2024-06-02'), profileUrl: '#' },
  { id: '14', rank: 14, studentName: 'Pooja Agarwal', avatar: 'leader-14', campaignCompleted: false, completionTime: createMockTimestamp('2024-06-03'), profileUrl: '#' },
  { id: '15', rank: 15, studentName: 'Harish Nair', avatar: 'leader-15', campaignCompleted: false, completionTime: createMockTimestamp('2024-06-04'), profileUrl: '#' },
];

    