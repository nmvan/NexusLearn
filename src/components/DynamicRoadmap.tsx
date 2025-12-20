import { CheckCircle2, Lock, MapPin, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface Module {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'current' | 'locked';
  isDailyTarget?: boolean;
}

interface DynamicRoadmapProps {
  goal: string | null;
}

export function DynamicRoadmap({ goal }: DynamicRoadmapProps) {
  // Mock data - in a real app, this would come from the backend based on the goal
  const modules: Module[] = [
    { id: 'm1', title: 'OS Basics', duration: '45m', status: 'completed' },
    { id: 'm2', title: 'Process Management', duration: '1h 20m', status: 'completed' },
    { id: 'm3', title: 'Context Switching', duration: '35m', status: 'current', isDailyTarget: true },
    { id: 'm4', title: 'Memory Management', duration: '2h', status: 'locked', isDailyTarget: true },
    { id: 'm5', title: 'File Systems', duration: '1h 15m', status: 'locked' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
          <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
          Your Roadmap
        </h3>
        {goal && (
          <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
            {goal}
          </span>
        )}
      </div>

      <div className="relative space-y-0">
        {/* Vertical connecting line */}
        <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

        {modules.map((module) => (
          <div key={module.id} className="relative pl-8 pb-6 last:pb-0 group">
            {/* Node Indicator */}
            <div className={cn(
              "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300",
              module.status === 'completed' ? "bg-indigo-600 border-indigo-600 text-white dark:bg-emerald-500 dark:border-emerald-500 dark:text-slate-950" :
              module.status === 'current' ? "bg-white dark:bg-slate-950 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]" :
              "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-700"
            )}>
              {module.status === 'completed' ? <CheckCircle2 size={14} /> :
               module.status === 'current' ? <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-pulse" /> :
               <Lock size={12} />}
            </div>

            {/* Content */}
            <div className={cn(
              "p-3 rounded-lg border transition-all cursor-pointer",
              module.status === 'current' ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30" : 
              "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
            )}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={cn(
                  "text-sm font-medium",
                  module.status === 'locked' ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-200"
                )}>
                  {module.title}
                </h4>
                {module.isDailyTarget && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-400/20" title="Daily Target">
                    <Calendar size={10} /> Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{module.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
