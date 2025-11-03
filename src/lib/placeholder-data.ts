

import type { TeamMember, Event, FaqItem, LeaderboardEntry } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';
import { Timestamp } from 'firebase/firestore';

// This file contains placeholder data.
// In a real application, this data would be fetched from a database.

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
