import React from 'react';
import { Trophy, Clock, FileText, BookOpen, Code, Zap } from 'lucide-react';

interface CourseOverviewProps {
  onContinue: () => void;
  hasPlan: boolean;
  onCreatePlan: () => void;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ onContinue, hasPlan, onCreatePlan }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
          NV
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back, Nhat Nguyen</h1>
          <p className="text-slate-500 dark:text-slate-400">Ready to master React today?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Study Plan Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Study Plan</h2>
          
          {!hasPlan ? (
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-lg flex flex-col items-center justify-center min-h-[300px]">
               <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                 <Zap size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Learning Path</h3>
               <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                 You haven't set up a study plan yet. Let AI create a personalized roadmap for you based on your goals and schedule.
               </p>
               <button 
                 onClick={onCreatePlan}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
               >
                 <Zap size={18} />
                 Create Learning Path
               </button>
             </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-lg flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-1/3">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Placeholder for the circular progress image */}
                <div className="w-32 h-32 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 relative">
                  <div className="absolute inset-0 rounded-full border-8 border-indigo-600 dark:border-indigo-500 border-t-transparent rotate-45"></div>
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">75%</span>
                </div>
                <div className="absolute -bottom-2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md border border-slate-200 dark:border-slate-700 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                  React Mastery
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1">
                <Clock size={14} />
                On Track
              </p>
            </div>

            <div className="flex-grow space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Progress</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Modules Completed</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 dark:text-yellow-500 font-bold">
                  <Trophy size={18} />
                  <span>18/24</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Advanced Patterns Unlocked</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-2">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>Completed: 18 Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Total: 24 Modules</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
                You're crushing it! Finish the "Context API" module to unlock the next project.
              </p>

              <button 
                onClick={onContinue}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <Zap size={18} />
                Continue Learning
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Learning Profile Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100">Learning Profile</h2>
            <button className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">View All</button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-lg">
            <h3 className="font-bold mb-4 text-slate-200">Skill Level: React</h3>
            <div className="flex justify-between items-center mb-8 relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10"></div>
              
              <div className="text-center bg-slate-900 px-2">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-slate-900 mx-auto mb-1"></div>
                <div className="text-xs text-slate-500">Junior</div>
                <div className="font-bold text-slate-300">Lvl 1</div>
              </div>
              <div className="text-center bg-slate-900 px-2">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-slate-900 mx-auto mb-1"></div>
                <div className="text-xs text-slate-500">Current</div>
                <div className="font-bold text-indigo-400">Lvl 3</div>
              </div>
              <div className="text-center bg-slate-900 px-2">
                <div className="w-3 h-3 rounded-full border-2 border-slate-600 bg-slate-900 mx-auto mb-1"></div>
                <div className="text-xs text-slate-500">Target</div>
                <div className="font-bold text-slate-300">Senior</div>
              </div>
            </div>

            <h3 className="font-bold mb-4 text-slate-200">Learning Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={16} className="text-indigo-500" />
                  <span className="text-sm">Total Hours</span>
                </div>
                <span className="font-bold text-indigo-400">42 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <Code size={16} className="text-emerald-500" />
                  <span className="text-sm">Lines of Code</span>
                </div>
                <span className="font-bold text-emerald-400">12,450</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText size={16} className="text-yellow-500" />
                  <span className="text-sm">Projects Built</span>
                </div>
                <span className="font-bold text-yellow-500">5</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen size={16} className="text-cyan-500" />
                  <span className="text-sm">Lessons Completed</span>
                </div>
                <span className="font-bold text-cyan-400">84</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
