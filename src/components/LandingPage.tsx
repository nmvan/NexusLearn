import React from 'react';
import { HeroSearch } from './HeroSearch';
import { CourseCard } from './CourseCard';
import { Sparkles } from 'lucide-react';

interface LandingPageProps {
  onCourseSelect: (courseId: string) => void;
}

const RECOMMENDED_COURSES = [
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

export function LandingPage({ onCourseSelect }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Path</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Master Your Craft <br />
            <span className="text-indigo-400">With Precision</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Stop wasting time on generic courses. Get a personalized curriculum tailored to your goals, skills, and learning style.
          </p>

          <HeroSearch />
        </div>
      </div>

      {/* Recommended Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Recommended for You</h2>
            <p className="text-slate-400">Based on your interest in "Frontend Architecture"</p>
          </div>
          <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View All Matches
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOMMENDED_COURSES.map((course) => (
            <div 
              key={course.id} 
              onClick={() => onCourseSelect(course.id)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <CourseCard {...course} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
