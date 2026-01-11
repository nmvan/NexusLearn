import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CourseCardProps } from './CourseCard';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  preferredLanguage: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  maxBudget: number;
  availableTimePerWeek: number; // hours
}

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseCardProps[];
  userProfile: UserProfile;
}

export function ComparisonModal({ isOpen, onClose, courses, userProfile }: ComparisonModalProps) {
  const navigate = useNavigate();
  
  // If no courses, don't render
  if (courses.length === 0) {
    return null;
  }
  // Helper to parse time commitment to hours
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Calculate suitability score and reasons for a course based on user profile
  const calculateSuitability = (course: CourseCardProps, user: UserProfile) => {
    // Use the existing matchScore as the suitability score
    const score = course.matchScore;
    
    let reasons: { text: string; detailed: string; positive: boolean }[] = [];

    // Generate reasons based on user profile matching
    const languageMatch = course.language?.toLowerCase() === user.preferredLanguage.toLowerCase();
    if (languageMatch) {
      reasons.push({
        text: "✓ Matches your preferred language",
        detailed: `This course is taught in ${course.language}, which matches your preferred language (${user.preferredLanguage}). Learning in your preferred language can improve comprehension and retention.`,
        positive: true
      });
    } else {
      reasons.push({
        text: "✗ Language doesn't match your preference",
        detailed: `This course is taught in ${course.language || 'an unknown language'}, but you prefer ${user.preferredLanguage}. Consider if you're comfortable learning in a different language.`,
        positive: false
      });
    }

    const levelMatch = course.level?.toLowerCase() === user.skillLevel;
    if (levelMatch) {
      reasons.push({
        text: "✓ Matches your skill level",
        detailed: `This course is designed for ${course.level} learners, which aligns with your ${user.skillLevel} skill level. This ensures the content pace and complexity are appropriate for you.`,
        positive: true
      });
    } else {
      reasons.push({
        text: "✗ Skill level may not be ideal for you",
        detailed: `This course targets ${course.level || 'unknown'} learners, but you're at a ${user.skillLevel} level. You might find it too challenging or too basic depending on the course content.`,
        positive: false
      });
    }

    const interestMatch = user.interests.some(interest =>
      course.title.toLowerCase().includes(interest.toLowerCase()) ||
      course.whatYouWillBuild.some(project => project.toLowerCase().includes(interest.toLowerCase()))
    );
    if (interestMatch) {
      reasons.push({
        text: "✓ Aligns with your interests",
        detailed: `This course covers topics that match your interests in ${user.interests.join(', ')}. You'll be more engaged and motivated to complete a course that aligns with your goals.`,
        positive: true
      });
    } else {
      reasons.push({
        text: "✗ May not align with your interests",
        detailed: `This course may not directly relate to your interests in ${user.interests.join(', ')}. Consider if the skills you'll learn will help you achieve your broader goals.`,
        positive: false
      });
    }

    const budgetMatch = (course.price || 0) <= user.maxBudget;
    if (budgetMatch) {
      reasons.push({
        text: "✓ Within your budget",
        detailed: `This course costs $${course.price}, which fits within your maximum budget of $${user.maxBudget}. This allows you to invest in your learning without financial strain.`,
        positive: true
      });
    } else {
      reasons.push({
        text: "✗ Exceeds your budget",
        detailed: `This course costs $${course.price}, which exceeds your maximum budget of $${user.maxBudget}. Consider if the value justifies the investment or look for alternative funding options.`,
        positive: false
      });
    }

    const courseTime = parseTime(course.timeCommitment || '');
    const timeMatch = courseTime <= user.availableTimePerWeek;
    if (timeMatch) {
      reasons.push({
        text: "✓ Fits your available time",
        detailed: `This course requires about ${courseTime} hours per week, which fits within your available ${user.availableTimePerWeek} hours. This ensures you can maintain a healthy work-life-learning balance.`,
        positive: true
      });
    } else {
      reasons.push({
        text: "✗ May require more time than you have available",
        detailed: `This course requires about ${courseTime} hours per week, but you only have ${user.availableTimePerWeek} hours available. Consider if you can adjust your schedule or if this course is right for your current commitments.`,
        positive: false
      });
    }

    return { score, reasons };
  };

  // Calculate suitability for all courses
  const courseSuitabilities = courses.map(course => ({
    ...course,
    ...calculateSuitability(course, userProfile)
  }));

  // Find the recommended course (highest suitability score)
  const recommendedCourse = courseSuitabilities.reduce((prev, curr) =>
    prev.score > curr.score ? prev : curr
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
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
                    AI analysis based on your profile and preferences.
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
                  {courseSuitabilities.map((course) => {
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

                  {/* Suitability Score Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50 flex items-center">
                    Suitability Score
                  </div>
                  {courseSuitabilities.map((course) => (
                    <div key={`score-${course.id}`} className="py-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", 
                              course.score >= 80 ? "bg-emerald-400" : 
                              course.score >= 60 ? "bg-cyan-400" : "bg-amber-400"
                            )}
                            style={{ width: `${course.score}%` }}
                          />
                        </div>
                        <span className={cn("font-bold",
                          course.score >= 80 ? "text-emerald-400" : 
                          course.score >= 60 ? "text-cyan-400" : "text-amber-400"
                        )}>{course.score}%</span>
                      </div>
                    </div>
                  ))}

                  {/* Reasons Row */}
                  <div className="font-semibold text-slate-300 py-4 border-t border-slate-800/50">
                    Why This Course?
                  </div>
                  {courseSuitabilities.map((course) => (
                    <div key={`reasons-${course.id}`} className="py-4 border-t border-slate-800/50">
                      <ul className="space-y-1">
                        {course.reasons.map((reason, idx) => (
                          <li key={idx} className="relative group">
                            <div className="flex items-start gap-2 text-sm text-slate-400 cursor-help">
                              <span className="mt-0.5 shrink-0">{reason.positive ? '✓' : '✗'}</span>
                              <span className={reason.positive ? 'text-emerald-400' : 'text-red-400'}>
                                {reason.text.substring(2)}
                              </span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs">
                              {reason.detailed}
                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 transform rotate-45"></div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Action Row */}
                  <div className="pt-4"></div>
                  {courseSuitabilities.map((course) => (
                    <div key={`action-${course.id}`} className="pt-4">
                      <button 
                        onClick={() => {
                          navigate('/dashboard');
                        }}
                        className={cn(
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
    </AnimatePresence>,
    document.body
  );
}
