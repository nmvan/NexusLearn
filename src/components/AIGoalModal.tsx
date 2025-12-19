import React, { useState } from 'react';
import { Target, Sparkles, X } from 'lucide-react';

interface AIGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetGoal: (goal: string) => void;
}

export function AIGoalModal({ isOpen, onClose, onSetGoal }: AIGoalModalProps) {
  const [goal, setGoal] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 text-indigo-400">
            <Sparkles size={24} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Set Your Learning Goal</h2>
          <p className="text-slate-400 mb-6">
            Tell our AI your target, and we'll build a dynamic roadmap just for you.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                What is your goal?
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Finish in 1 week, Master basics only..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setGoal('Finish in 1 week')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg border border-slate-700 transition-colors"
              >
                🚀 Finish in 1 week
              </button>
              <button 
                onClick={() => setGoal('Just browsing')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg border border-slate-700 transition-colors"
              >
                👀 Just browsing
              </button>
            </div>

            <button
              onClick={() => onSetGoal(goal)}
              disabled={!goal.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              Generate My Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
