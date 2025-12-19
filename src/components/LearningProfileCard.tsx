import React from 'react';
import { User, Clock, TrendingUp } from 'lucide-react';

interface LearningProfileCardProps {
  goal: string | null;
}

export function LearningProfileCard({ goal }: LearningProfileCardProps) {
  if (!goal) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
          <User size={20} className="text-slate-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Learning Profile</h3>
          <p className="text-xs text-slate-400">Personalized for you</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-slate-400 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" /> Pace
          </span>
          <span className="text-slate-200 font-medium">Aggressive</span>
        </div>
        
        <div className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-slate-400 flex items-center gap-2">
            <Clock size={14} className="text-cyan-400" /> Est. Completion
          </span>
          <span className="text-slate-200 font-medium">Dec 24, 2025</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 text-center">
          Based on your goal: <span className="text-indigo-400">{goal}</span>
        </p>
      </div>
    </div>
  );
}
