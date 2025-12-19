import { useState } from 'react';
import { LearningDashboard } from './components/LearningDashboard';
import { LandingPage, type Course } from './components/LandingPage';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns & Performance',
    instructor: 'Sarah Drasner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    matchScore: 98,
    lastUpdated: '2 days ago',
    timeCommitment: '10 hours',
    whatYouWillBuild: ['Custom Hooks Library', 'State Management System', 'Performance Dashboard'],
  },
  {
    id: '2',
    title: 'Fullstack Next.js 14: The Complete Guide',
    instructor: 'Maximilian Schwarzmüller',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1964&auto=format&fit=crop',
    matchScore: 92,
    lastUpdated: '1 week ago',
    timeCommitment: '24 hours',
    whatYouWillBuild: ['E-commerce Platform', 'Social Network', 'SaaS Application'],
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass for Developers',
    instructor: 'Gary Simon',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2070&auto=format&fit=crop',
    matchScore: 85,
    lastUpdated: '3 weeks ago',
    timeCommitment: '15 hours',
    whatYouWillBuild: ['Design System', 'Mobile App Prototype', 'Portfolio Website'],
  },
];

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  const handleCourseSelect = (courseId: string) => {
    console.log(`Selected course: ${courseId}`);
    setCurrentView('dashboard');
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onCourseSelect={handleCourseSelect} courses={MOCK_COURSES} />
      ) : (
        <LearningDashboard />
      )}
    </>
  );
}
