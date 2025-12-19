import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight, BrainCircuit } from 'lucide-react';
import { CourseCard, type CourseCardProps } from './CourseCard';
import { ComparisonModal } from './ComparisonModal';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "I have 2 hours/day, help me learn Python",
  "Build a roadmap for Frontend Intern",
  "Explain Machine Learning like I'm 5",
  "Best design patterns for React"
];

const MOCK_COURSES: CourseCardProps[] = [
  {
    id: 's1',
    title: 'Complete Python Bootcamp: Go from zero to hero in Python 3',
    instructor: 'Jose Portilla',
    thumbnailUrl: 'https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg',
    matchScore: 98,
    lastUpdated: '2 days ago',
    timeCommitment: '22 hours total',
    whatYouWillBuild: ['Tic Tac Toe', 'Blackjack', 'Web Scraper'],
    level: 'Beginner',
    language: 'Python',
    isBeginnerFriendly: true,
    detailedRating: 4.8,
    price: 19.99
  },
  {
    id: 's2',
    title: 'Machine Learning A-Z™: AI, Python & R + ChatGPT Prize [2024]',
    instructor: 'Kirill Eremenko',
    thumbnailUrl: 'https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg',
    matchScore: 95,
    lastUpdated: '1 week ago',
    timeCommitment: '42 hours total',
    whatYouWillBuild: ['Data Preprocessing Template', 'Regression Models', 'Reinforcement Learning AI'],
    level: 'Intermediate',
    language: 'Python',
    isBeginnerFriendly: false,
    detailedRating: 4.7,
    price: 24.99
  },
  {
    id: 's3',
    title: '100 Days of Code: The Complete Python Pro Bootcamp for 2024',
    instructor: 'Dr. Angela Yu',
    thumbnailUrl: 'https://img-c.udemycdn.com/course/750x422/2776760_f176_10.jpg',
    matchScore: 92,
    lastUpdated: '3 days ago',
    timeCommitment: '60 hours total',
    whatYouWillBuild: ['Snake Game', 'Pong', 'Blog Website'],
    level: 'Beginner',
    language: 'Python',
    isBeginnerFriendly: true,
    detailedRating: 4.9,
    price: 22.99
  },
  {
    id: 's4',
    title: 'Python for Data Science and Machine Learning Bootcamp',
    instructor: 'Jose Portilla',
    thumbnailUrl: 'https://img-c.udemycdn.com/course/750x422/903744_8eb2.jpg',
    matchScore: 88,
    lastUpdated: '1 month ago',
    timeCommitment: '25 hours total',
    whatYouWillBuild: ['Data Visualizations', 'K-Means Clustering', 'Neural Networks'],
    level: 'Intermediate',
    language: 'Python',
    isBeginnerFriendly: false,
    detailedRating: 4.6,
    price: 18.99
  }
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // New state for search results
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state on close
      setQuery('');
      setIsThinking(false);
      setShowResults(false);
      setIsBeginnerMode(false);
      setSelectedCourseIds([]);
      setIsComparisonOpen(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsThinking(true);
    setShowResults(false);

    // Simulate AI processing
    setTimeout(() => {
      setIsThinking(false);
      setShowResults(true);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCompareToggle = (courseId: string, checked: boolean) => {
    if (checked) {
      if (selectedCourseIds.length < 3) {
        setSelectedCourseIds(prev => [...prev, courseId]);
      } else {
        alert("You can compare up to 3 courses at a time.");
      }
    } else {
      setSelectedCourseIds(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleAICompare = () => {
    if (selectedCourseIds.length < 2) return;
    setIsComparisonOpen(true);
  };

  const displayedCourses = isBeginnerMode 
    ? MOCK_COURSES.filter(c => c.isBeginnerFriendly)
    : MOCK_COURSES;

  const selectedCourses = MOCK_COURSES.filter(c => selectedCourseIds.includes(c.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-xl overflow-y-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-start pt-20 px-4 max-w-7xl mx-auto w-full pb-20">
            
            {/* Search Input Area */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-4xl relative"
            >
              <div className="relative flex items-center group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                <Search className="absolute left-4 w-6 h-6 text-cyan-400" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything... (e.g., 'Create a study plan for UX Design')"
                  className="w-full bg-black/40 border border-white/10 focus:border-cyan-500/50 rounded-2xl py-6 pl-14 pr-14 text-xl text-white placeholder:text-slate-500 shadow-2xl outline-none transition-all backdrop-blur-md"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-4 p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Dynamic Content Area */}
            <div className="w-full mt-8">
              <AnimatePresence mode="wait">
                
                {/* State 1: Suggestions */}
                {!isThinking && !showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 max-w-4xl mx-auto"
                  >
                    <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider ml-1">
                      Suggested Prompts
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {SUGGESTIONS.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(suggestion);
                            // Optional: auto-search on click
                            // handleSearch(); 
                          }}
                          className="px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all text-sm text-secondary-foreground flex items-center gap-2"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* State 2: AI Thinking */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <div className="relative w-16 h-16">
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-primary/30"
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-t-primary"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <p className="text-lg font-medium animate-pulse text-primary">
                      AI is analyzing your request...
                    </p>
                  </motion.div>
                )}

                {/* State 3: Results (Course List) */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    {/* Controls Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Search Results
                        </h2>
                        <p className="text-slate-400">
                          Found {displayedCourses.length} courses for "{query}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Beginner Toggle */}
                        <div 
                          className="flex items-center gap-3 cursor-pointer group select-none"
                          onClick={() => setIsBeginnerMode(!isBeginnerMode)}
                        >
                          <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                            isBeginnerMode 
                              ? 'bg-cyan-950/50 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                              : 'bg-slate-900/50 border border-slate-700'
                          }`}>
                            <motion.div 
                              className={`absolute top-1 left-1 w-3.5 h-3.5 rounded-full shadow-sm ${
                                isBeginnerMode ? 'bg-cyan-400 shadow-cyan-400/50' : 'bg-slate-500'
                              }`}
                              animate={{ x: isBeginnerMode ? 24 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                          <span className={`text-sm font-medium transition-colors ${
                            isBeginnerMode ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                          }`}>
                            Beginner Friendly
                          </span>
                        </div>

                        {/* Compare Button */}
                        <button
                          onClick={handleAICompare}
                          disabled={selectedCourseIds.length < 2}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                            selectedCourseIds.length >= 2
                              ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:text-indigo-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                              : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <BrainCircuit className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Compare ({selectedCourseIds.length})
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedCourses.map((course) => (
                        <CourseCard 
                          key={course.id}
                          {...course} 
                          isSelectedForComparison={selectedCourseIds.includes(course.id)}
                          onCompareToggle={handleCompareToggle}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Comparison Modal */}
          <ComparisonModal 
            isOpen={isComparisonOpen}
            onClose={() => setIsComparisonOpen(false)}
            courses={selectedCourses}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
