
import type { Timestamp } from 'firebase/firestore';

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
  startDate: Timestamp;
  endDate: Timestamp;
  time: string;
  venue: string;
  imageUrl: string;
  type: 'Workshop' | 'Hackathon' | 'Seminar' | 'Study Jam' | 'Tech Talk' | 'Info Session';
  status: 'Upcoming' | 'Past' | 'Continue';
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  studentName: string;
  avatar: string;
  campaignCompleted: boolean;
  completionTime: Timestamp;
  profileUrl: string;
  eventId: string;
  eventName: string;
};

export type EventRegistration = {
    id: string;
    name: string;
    email: string;
    phone: string;
    rollNo: string;
    branch: string;
    year: string;
    eventId: string;
    eventName: string;
    registeredAt: Timestamp;
};

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Timestamp;
    isRead: boolean;
};

export type StatItem = {
    id: string;
    icon: string;
    value: number;
    label: string;
    color: string;
    order: number;
};
