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
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl opacity-30 group-hover:opacity-100 blur transition duration-500" />
          
          {/* Search Bar Container */}
          <div className="relative flex items-center bg-background rounded-2xl p-4 shadow-sm border border-border">
            <Search className="w-6 h-6 text-muted-foreground ml-2" />
            
            <div className="ml-4 flex-1">
              <span className="text-muted-foreground text-lg font-medium">
                What do you want to learn today?
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground font-mono">
                Ctrl + K
              </span>
            </div>
            
            <div className="p-2 bg-primary/10 rounded-xl ml-2">
              <Sparkles className="w-5 h-5 text-primary" />
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
