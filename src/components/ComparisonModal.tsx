import { X, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CourseCardProps } from './CourseCard';
import { cn } from '../lib/utils';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseCardProps[];
}

export function ComparisonModal({ isOpen, onClose, courses }: ComparisonModalProps) {
  // Helper to parse relative time to days
  const getDaysAgo = (dateString: string): number => {
    const value = parseInt(dateString);
    if (dateString.includes('day')) return value;
    if (dateString.includes('week')) return value * 7;
    if (dateString.includes('month')) return value * 30;
    if (dateString.includes('year')) return value * 365;
    return 9999;
  };

  // Find the course with the best "Update-to-Price" ratio (approximated by most recent update)
  // as per Use Case 3 requirements to avoid stale content.
  const recommendedCourse = courses.reduce((prev, current) => {
    const prevDays = getDaysAgo(prev.lastUpdated);
    const currDays = getDaysAgo(current.lastUpdated);
    return (prevDays < currDays) ? prev : current;
  }, courses[0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Compare Courses
                    <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {courses.length} selected
                    </span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    AI analysis suggests the best fit based on your goals.
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-auto p-6">
                <div className="grid gap-6" style={{ gridTemplateColumns: `150px repeat(${courses.length}, minmax(250px, 1fr))` }}>
                  
                  {/* Row Headers (Empty top-left) */}
                  <div className="pt-4"></div>

                  {/* Course Headers */}
                  {courses.map((course) => {
                    const isRecommended = course.id === recommendedCourse.id;
                    return (
                      <div key={course.id} className="relative flex flex-col gap-3">
                        {isRecommended && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                            <Sparkles className="w-3 h-3" />
                            AI Recommended
                          </div>
                        )}
                        <div className={cn(
                          "rounded-xl overflow-hidden border-2 transition-colors",
                          isRecommended ? "border-indigo-500" : "border-transparent"
                        )}>
                          <img src={course.thumbnailUrl} alt={course.title} className="h-32 w-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg text-white leading-tight">{course.title}</h3>
                        <p className="text-sm text-slate-400">{course.instructor}</p>
                      </div>
                    );
                  })}

                  {/* Match Score Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Match Score
                  </div>
                  {courses.map((course) => (
                    <div key={`score-${course.id}`} className="py-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", 
                              course.matchScore >= 90 ? "bg-emerald-400" : 
                              course.matchScore >= 70 ? "bg-cyan-400" : "bg-amber-400"
                            )}
                            style={{ width: `${course.matchScore}%` }}
                          />
                        </div>
                        <span className={cn("font-bold",
                          course.matchScore >= 90 ? "text-emerald-400" : 
                          course.matchScore >= 70 ? "text-cyan-400" : "text-amber-400"
                        )}>{course.matchScore}%</span>
                      </div>
                    </div>
                  ))}

                  {/* Price Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Price
                  </div>
                  {courses.map((course) => (
                    <div key={`price-${course.id}`} className="py-4 border-t border-slate-800/50 text-slate-300 font-medium">
                      ${course.price}
                    </div>
                  ))}

                  {/* Rating Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Rating
                  </div>
                  {courses.map((course) => (
                    <div key={`rating-${course.id}`} className="py-4 border-t border-slate-800/50 text-slate-300">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span>{course.detailedRating}</span>
                      </div>
                    </div>
                  ))}

                  {/* Language Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Language
                  </div>
                  {courses.map((course) => (
                    <div key={`lang-${course.id}`} className="py-4 border-t border-slate-800/50 text-slate-300">
                      {course.language}
                    </div>
                  ))}

                  {/* Level Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Level
                  </div>
                  {courses.map((course) => (
                    <div key={`level-${course.id}`} className="py-4 border-t border-slate-800/50 text-slate-300">
                      {course.level}
                      {course.isBeginnerFriendly && (
                        <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Beginner Friendly
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Last Updated Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Last Updated
                  </div>
                  {courses.map((course) => {
                    const courseDate = new Date(course.lastUpdated).getTime();
                    const maxDate = Math.max(...courses.map(c => new Date(c.lastUpdated).getTime()));
                    const isNewest = courseDate === maxDate;
                    
                    return (
                      <div key={`updated-${course.id}`} className="py-4 border-t border-slate-800/50 text-slate-300">
                        <div className={cn("inline-flex items-center gap-2", isNewest && "text-emerald-400 font-medium")}>
                          {course.lastUpdated}
                          {isNewest && (
                            <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse">
                              Fresh
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Time Commitment Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Time Commitment
                  </div>
                  {courses.map((course) => (
                    <div key={`time-${course.id}`} className="py-4 border-t border-slate-800/50 text-slate-300">
                      {course.timeCommitment}
                    </div>
                  ))}

                  {/* Key Projects Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50">
                    Key Projects
                  </div>
                  {courses.map((course) => (
                    <div key={`projects-${course.id}`} className="py-4 border-t border-slate-800/50">
                      <ul className="space-y-2">
                        {course.whatYouWillBuild.map((project, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                            <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                            <span>{project}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Action Row */}
                  <div className="pt-4"></div>
                  {courses.map((course) => (
                    <div key={`action-${course.id}`} className="pt-4">
                      <button className={cn(
                        "w-full py-2.5 rounded-lg font-medium transition-all",
                        course.id === recommendedCourse.id
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      )}>
                        Start Learning
                      </button>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
