import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchOverlay } from './SearchOverlay';

export function HeroSearch() {
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

        {/* Helper Text */}
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
