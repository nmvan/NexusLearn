import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AISidebar } from './AISidebar';
import { PeerReviewSection } from './PeerReviewSection';
import { AIGoalModal } from './AIGoalModal';
import { DynamicRoadmap } from './DynamicRoadmap';
import { LearningProfileCard } from './LearningProfileCard';
import { BookOpen, Layout, Share2, Zap, ArrowRight, X, LogOut, CreditCard, Settings } from 'lucide-react';

export function LessonView() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [goal, setGoal] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(true);

  const handleSetGoal = (newGoal: string) => {
    setGoal(newGoal);
    setIsGoalModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <AIGoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        onSetGoal={handleSetGoal} 
      />
      {/* Dashboard Header - Removed as global header is now used */}
      
      <main className="container mx-auto px-4 py-6">
        {/* Active Roadmap / Action Center (Zero-Spam Strategy) */}
        <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="absolute -right-10 -top-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400">
                  <Zap size={14} />
                </span>
                <h2 className="text-lg font-semibold text-white">Active Roadmap</h2>
              </div>
              
              {/* Nudge Logic: Context-aware AI message */}
              <p className="text-slate-300 mb-4 max-w-2xl">
                <span className="text-indigo-400 font-medium">Hey Nhat,</span> you're <span className="text-white font-bold">80%</span> through Chapter 2. Finish it now to unlock your certificate!
              </p>

              {/* Pulse Bar: High-visibility progress */}
              <div className="w-full max-w-md bg-slate-800 rounded-full h-2.5 mb-1">
                <div className="bg-indigo-500 h-2.5 rounded-full w-[80%] shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse"></div>
              </div>
              <p className="text-xs text-slate-500 font-mono">Progress: 80% • Est. time remaining: 12m</p>
            </div>

            <div className="flex items-center gap-3">
               <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                 Resume Learning <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (Video + Notes) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Anchor */}
            <div id="dashboard-video-anchor" className="w-full aspect-video"></div>
            
            {/* Documentation / Transcript Area */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-slate-100">Lesson Transcript & Notes</h2>
              <div className="prose prose-invert max-w-none text-slate-400">
                <p>
                  In computing, a context switch is the process of storing the state of a process or thread, so that it can be restored and resume execution at a later point. This allows multiple processes to share a single central processing unit (CPU), and is an essential feature of a multitasking operating system.
                </p>
                <p>
                  The precise meaning of the phrase "context switch" varies significantly in usage. In a multitasking context, it refers to the process of storing the system state for one task, so that task can be paused and another task resumed. A context switch can also occur as the result of an interrupt, such as when a task needs to access disk storage, freeing up CPU time for other tasks.
                </p>
                <h3 className="text-lg font-medium text-slate-200 mt-4">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Context switching is overhead; the system does no useful work while switching.</li>
                  <li>Speed varies depending on the memory speed, the number of registers that must be copied, and the existence of special instructions.</li>
                  <li>It is the basis for multitasking.</li>
                </ul>
                <p className="mt-4">
                  (Scroll down to test the Picture-in-Picture mode...)
                </p>
                {/* Adding dummy content to enable scrolling */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <p key={i} className="opacity-50">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                ))}
              </div>
            </div>

            <PeerReviewSection />
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <LearningProfileCard goal={goal} />
              <DynamicRoadmap goal={goal} />
              <AISidebar />
              
              {/* No-Dark-Patterns: Subscription Management */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Membership</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">Plan</span>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Pro Trial</span>
                </div>
                <button className="w-full text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-1 py-2 border border-transparent hover:border-slate-800 rounded">
                  <X size={12} /> Cancel Trial (1-Click)
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
