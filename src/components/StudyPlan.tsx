import React from 'react';
import { Calendar, Target, CheckCircle, Clock, Info, List, LayoutGrid, Trophy, AlertCircle, Zap } from 'lucide-react';

interface StudyPlanProps {
  onStartLesson: () => void;
  hasPlan: boolean;
  onCreatePlan: () => void;
}

interface Module {
  id: number;
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'locked';
  topics: string[];
  score?: string;
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ onStartLesson, hasPlan, onCreatePlan }) => {
  // Mock generated plan data
  const modules: Module[] = [
    {
      id: 1,
      title: "React Fundamentals",
      date: "Mon, Dec 20",
      status: "completed",
      score: "10/10",
      topics: ["JSX & Rendering", "Components & Props", "State Management Basics"]
    },
    {
      id: 2,
      title: "Hooks Deep Dive",
      date: "Wed, Dec 22",
      status: "completed",
      score: "9/10",
      topics: ["useEffect & Lifecycle", "Custom Hooks", "useRef & useMemo"]
    },
    {
      id: 3,
      title: "Context API & Reducer",
      date: "Fri, Dec 24",
      status: "in-progress",
      topics: ["Global State Management", "useReducer Pattern", "Context Best Practices"]
    },
    {
      id: 4,
      title: "Routing with React Router",
      date: "Mon, Dec 27",
      status: "locked",
      topics: ["Dynamic Routes", "Nested Layouts", "Protected Routes"]
    },
    {
      id: 5,
      title: "API Integration",
      date: "Wed, Dec 29",
      status: "locked",
      topics: ["Fetch & Axios", "React Query Basics", "Error Handling"]
    },
    {
      id: 6,
      title: "Performance Optimization",
      date: "Fri, Dec 31",
      status: "locked",
      topics: ["Code Splitting", "Lazy Loading", "React.memo"]
    }
  ];

  if (!hasPlan) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 max-w-2xl w-full shadow-xl flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-6">
              <Target size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No Active Study Plan</h2>
            <p className="text-slate-400 mb-8 max-w-md">
              You haven't set up a learning path yet. Create one now to get a personalized schedule tailored to your goals and free time.
            </p>
            <button
              onClick={onCreatePlan}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Zap size={20} />
              Create Personalized Plan
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Main Content - Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              React Mastery Plan <Info size={16} className="text-slate-500" />
            </h2>
            <p className="text-slate-400 text-sm">Target: Jan 30, 2026</p>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button className="p-2 rounded-md bg-slate-700 text-white shadow-sm">
              <LayoutGrid size={18} />
            </button>
            <button className="p-2 rounded-md text-slate-400 hover:text-white">
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.map((module) => (
            <div 
              key={module.id}
              className={`rounded-xl border p-5 flex flex-col h-full transition-all ${
                module.status === 'completed' 
                  ? 'bg-emerald-950/10 border-emerald-500/30' 
                  : module.status === 'in-progress'
                  ? 'bg-indigo-950/10 border-indigo-500/50 ring-1 ring-indigo-500/20'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  module.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  module.status === 'in-progress' ? 'bg-indigo-500/20 text-indigo-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  Module {module.id}
                </div>
                {module.score && (
                  <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                    <Trophy size={14} />
                    {module.score}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-1">{module.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <Calendar size={14} />
                {module.date}
              </div>

              <div className="space-y-2 mb-6 flex-1">
                {module.topics.map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${
                      module.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'
                    }`} />
                    {topic}
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-800/50">
                {module.status === 'completed' ? (
                  <div className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <CheckCircle size={16} />
                    Completed on {module.date}
                  </div>
                ) : module.status === 'in-progress' ? (
                  <button 
                    onClick={onStartLesson}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <div className="text-slate-500 text-sm flex items-center gap-2">
                    <Clock size={16} />
                    Unlock on {module.date}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Progress */}
      <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
        <h3 className="font-bold text-white mb-6">Study Progress</h3>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Days Remaining</span>
            <span className="text-white font-bold">45 days</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Modules Completed</span>
            <span className="text-yellow-500 font-bold flex items-center gap-1">
              <Trophy size={14} /> 2/6
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300 font-medium">Overall Progress</span>
              <span className="text-indigo-400">33%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Completed: 2</span>
              <span>Total: 6</span>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-200 font-medium mb-1">Behind Schedule</p>
                <p className="text-xs text-slate-400">
                  You have <span className="text-red-400 font-bold">1 unfinished module</span> from last week. Consider rescheduling to stay on track.
                </p>
              </div>
            </div>
            <button className="w-full mt-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              Reschedule Plan
            </button>
          </div>

          <div className="bg-indigo-600/10 rounded-xl p-4 border border-indigo-500/20">
            <p className="text-sm text-indigo-200 mb-2">
              "Consistency is key! Complete Module 3 by Friday to maintain your streak."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
