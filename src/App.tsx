import { useState } from 'react';
import Header from './components/Header';
import { LearningDashboard } from './components/LearningDashboard';
import { LandingPage, type Course } from './components/LandingPage';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { NoteCentral } from './components/NoteCentral';
import { VideoProvider } from './context/VideoContext';
import { VideoPlayer } from './components/VideoPlayer';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'React Mastery: The Complete Guide',
    instructor: 'Sarah Drasner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    matchScore: 98,
    lastUpdated: '2 days ago',
    timeCommitment: '10 hours',
    whatYouWillBuild: ['A Real-time Trading Dashboard', 'AI-powered Chat App', 'Custom Component Library'],
    level: 'Advanced',
    language: 'English',
    techStack: ['React'],
    isBeginnerFriendly: false,
    detailedRating: 4.9,
    price: 99,
  },
  {
    id: '2',
    title: 'React for Professionals',
    instructor: 'Maximilian Schwarzmüller',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1964&auto=format&fit=crop',
    matchScore: 75,
    lastUpdated: '6 months ago',
    timeCommitment: '24 hours',
    whatYouWillBuild: ['Enterprise SaaS Platform', 'Complex State Management System', 'Micro-frontend Architecture'],
    level: 'Intermediate',
    language: 'English',
    techStack: ['React'],
    isBeginnerFriendly: false,
    detailedRating: 4.7,
    price: 89,
  },
  {
    id: '3',
    title: 'Complete React Developer in 2023',
    instructor: 'Andrei Neagoie',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2070&auto=format&fit=crop',
    matchScore: 45,
    lastUpdated: '4 years ago',
    timeCommitment: '40 hours',
    whatYouWillBuild: ['E-commerce Site (Class Components)', 'Redux Saga Implementation', 'Legacy Context API Demo'],
    level: 'Beginner',
    language: 'Vietnamese Sub',
    techStack: ['React'],
    isBeginnerFriendly: true,
    detailedRating: 4.5,
    price: 49,
  },
  {
    id: '4',
    title: 'React.js: Getting Started',
    instructor: 'Pluralsight',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    matchScore: 60,
    lastUpdated: '2 years ago',
    timeCommitment: '5 hours',
    whatYouWillBuild: ['Todo App', 'Weather Widget', 'Simple Blog'],
    level: 'Beginner',
    language: 'English',
    techStack: ['React'],
    isBeginnerFriendly: true,
    detailedRating: 4.2,
    price: 29,
  },
  {
    id: '5',
    title: 'Advanced React Patterns',
    instructor: 'Kent C. Dodds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop',
    matchScore: 95,
    lastUpdated: '1 week ago',
    timeCommitment: '12 hours',
    whatYouWillBuild: ['Compound Components System', 'Render Props Library', 'State Reducer Pattern'],
    level: 'Advanced',
    language: 'English',
    techStack: ['React'],
    isBeginnerFriendly: false,
    detailedRating: 4.8,
    price: 129,
  },
];

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'subscription' | 'notes'>('landing');
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const handleCourseSelect = (courseId: string) => {
    console.log(`Selected course: ${courseId}`);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: 'landing' | 'dashboard' | 'subscription' | 'notes') => {
    setCurrentView(view);
  };

  return (
    <VideoProvider>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        {currentView !== 'dashboard' && <Header onNavigate={handleNavigate} currentView={currentView} />}
        
        <main>
          {currentView !== 'landing' && (
            <VideoPlayer 
              src={videoSrc} 
              forcePip={currentView !== 'dashboard'} 
              className="w-full"
            />
          )}

          {currentView === 'landing' && (
            <LandingPage onCourseSelect={handleCourseSelect} courses={MOCK_COURSES} />
          )}
          {currentView === 'dashboard' && (
            <LearningDashboard onNavigate={handleNavigate} />
          )}
          {currentView === 'subscription' && (
            <SubscriptionManagement onBack={() => setCurrentView('landing')} />
          )}
          {currentView === 'notes' && (
            <NoteCentral />
          )}
        </main>
      </div>
    </VideoProvider>
  );
}
