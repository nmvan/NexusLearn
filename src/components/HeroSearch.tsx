import { useState } from 'react';
import { Search, Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchOverlay } from './SearchOverlay';

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
          <div className="absolute -top-8 right-0 flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </div>
            <span className="text-xs font-mono text-cyan-400/90 tracking-widest uppercase shadow-cyan-500/50">AI Status: Online</span>
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-500" />
          
          {/* Search Bar Container */}
          <div className="relative flex items-center bg-black/40 backdrop-blur-xl rounded-2xl p-4 shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-white/10 group-hover:border-cyan-500/30 transition-colors duration-300">
            <Search className="w-6 h-6 text-cyan-400/70 ml-2" />
            
            <div className="ml-4 flex-1">
              <span className="text-slate-400 text-lg font-medium group-hover:text-cyan-100/80 transition-colors">
                What do you want to learn today?
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-cyan-400/60 font-mono">
                Ctrl + K
              </span>
            </div>
            
            <div className="p-2 bg-cyan-500/10 rounded-xl ml-2 border border-cyan-500/20">
              <Sparkles className="w-5 h-5 text-cyan-400" />
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
