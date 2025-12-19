import { useState } from 'react';
import { Search, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchOverlay } from './SearchOverlay';
import { cn } from '../lib/utils';

interface HeroSearchProps {
  isBeginnerMode?: boolean;
  setIsBeginnerMode?: (value: boolean) => void;
  onAICompare?: () => void;
}

export function HeroSearch({ isBeginnerMode = false, setIsBeginnerMode, onAICompare }: HeroSearchProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOverlayOpen(true)}
          className="relative group cursor-pointer"
        >
          {/* AI Status Badge */}
          <div className={cn(
            "absolute -top-8 right-0 flex items-center gap-2 px-2 py-1 rounded-full border transition-all duration-300",
            "bg-sky-100 border-sky-200 text-indigo-900", // Light Mode
            "dark:bg-transparent dark:border-transparent dark:text-cyan-400/90" // Dark Mode
          )}>
            <div className="relative flex h-2 w-2">
              <span className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                "bg-indigo-500 animate-pulse", // Light Mode: Gentle pulse
                "dark:bg-cyan-400 dark:animate-ping" // Dark Mode: Ping
              )}></span>
              <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                "bg-indigo-600", // Light Mode
                "dark:bg-cyan-500" // Dark Mode
              )}></span>
            </div>
            <span className={cn(
              "text-xs font-mono tracking-widest uppercase",
              "dark:shadow-cyan-500/50"
            )}>AI Status: Online</span>
          </div>

          {/* Glow Effect - Dark Mode Only */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 dark:opacity-30 dark:group-hover:opacity-100 blur transition duration-500" />
          
          {/* Search Bar Container */}
          <div className={cn(
            "relative flex items-center rounded-2xl p-4 transition-all duration-300",
            // Light Mode
            "bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm shadow-indigo-100",
            "group-hover:bg-indigo-50/50 group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_rgba(224,231,255,0.6)]",
            // Dark Mode
            "dark:bg-black/40 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]",
            "dark:group-hover:border-cyan-500/30"
          )}>
            <Search className="w-6 h-6 text-slate-400 dark:text-cyan-400/70 ml-2" />
            
            <div className="ml-4 flex-1">
              <span className="text-slate-500 dark:text-slate-400 text-lg font-medium group-hover:text-indigo-600 dark:group-hover:text-cyan-100/80 transition-colors">
                What do you want to learn today?
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-cyan-400/60 font-mono">
                Ctrl + K
              </span>
            </div>
            
            <div className="p-2 bg-indigo-100 dark:bg-cyan-500/10 rounded-xl ml-2 border border-indigo-200 dark:border-cyan-500/20">
              <Sparkles className="w-5 h-5 text-indigo-700 dark:text-cyan-400 drop-shadow-[0_1px_2px_rgba(125,211,252,0.8)]" />
            </div>
          </div>
        </motion.div>

        {/* Helper Text & Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          {/* Beginner Toggle */}
          {setIsBeginnerMode && (
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
                isBeginnerMode ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                Beginner Friendly
              </span>
            </div>
          )}

          {/* AI Compare Button */}
          {onAICompare && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAICompare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] group"
            >
              <BrainCircuit className="w-4 h-4 group-hover:text-indigo-100 transition-colors" />
              <span className="text-sm font-medium">AI Compare</span>
            </motion.button>
          )}
        </div>
        
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
          <span>Try: "Python for Data Science"</span>
          <span>•</span>
          <span>"UX Design Roadmap"</span>
        </div>
      </div>

      <SearchOverlay 
        isOpen={isOverlayOpen} 
        onClose={() => setIsOverlayOpen(false)} 
      />
    </>
  );
}
