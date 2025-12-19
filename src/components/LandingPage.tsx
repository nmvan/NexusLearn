import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSearch } from './HeroSearch';
import { CourseCard, type CourseCardProps } from './CourseCard';
import { ComparisonModal } from './ComparisonModal';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Course extends Omit<CourseCardProps, 'onCompareToggle' | 'isSelectedForComparison' | 'className'> {}

interface LandingPageProps {
  onCourseSelect?: (courseId: string) => void;
  courses: Course[];
}

export function LandingPage({ onCourseSelect, courses }: LandingPageProps) {
  const navigate = useNavigate();
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);

  const handleCompareToggle = (courseId: string, checked: boolean) => {
    if (checked) {
      if (selectedCourseIds.length < 3) {
        setSelectedCourseIds(prev => [...prev, courseId]);
      } else {
        // Optional: Show toast that max 3 courses can be compared
        alert("You can compare up to 3 courses at a time.");
      }
    } else {
      setSelectedCourseIds(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleAICompare = () => {
    const sortedCourses = [...courses].sort((a, b) => b.matchScore - a.matchScore);
    const top3 = sortedCourses.slice(0, 3);
    setSelectedCourseIds(top3.map(c => c.id));
    setIsComparisonOpen(true);
  };

  const displayedCourses = isBeginnerMode 
    ? courses.filter(c => c.isBeginnerFriendly)
    : courses;

  const selectedCourses = courses.filter(c => selectedCourseIds.includes(c.id));

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

          <HeroSearch 
            isBeginnerMode={isBeginnerMode}
            setIsBeginnerMode={setIsBeginnerMode}
            onAICompare={handleAICompare}
          />
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
          {displayedCourses.map((course) => (
            <div 
              key={course.id} 
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <CourseCard 
                {...course} 
                isSelectionMode={true}
                isSelectedForComparison={selectedCourseIds.includes(course.id)}
                onCompareToggle={handleCompareToggle}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Floating Bar */}
      <AnimatePresence>
        {selectedCourseIds.length >= 2 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-full shadow-2xl shadow-indigo-500/20 p-2 pl-6 flex items-center gap-4">
              <span className="text-slate-200 font-medium">
                {selectedCourseIds.length} courses selected
              </span>
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                Compare Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setSelectedCourseIds([])}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <span className="sr-only">Clear selection</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComparisonModal 
        isOpen={isComparisonOpen} 
        onClose={() => setIsComparisonOpen(false)} 
        courses={selectedCourses} 
      />
    </div>
  );
}
