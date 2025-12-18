import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight, BookOpen } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "I have 2 hours/day, help me learn Python",
  "Build a roadmap for Frontend Intern",
  "Explain Machine Learning like I'm 5",
  "Best design patterns for React"
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset state on close
      setQuery('');
      setIsThinking(false);
      setShowResults(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsThinking(true);
    setShowResults(false);

    // Simulate AI processing
    setTimeout(() => {
      setIsThinking(false);
      setShowResults(true);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-md"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 flex flex-col items-center justify-start pt-20 px-4 max-w-4xl mx-auto w-full">
            
            {/* Search Input Area */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full relative"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-6 h-6 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything... (e.g., 'Create a study plan for UX Design')"
                  className="w-full bg-background border-2 border-primary/20 focus:border-primary rounded-2xl py-6 pl-14 pr-14 text-xl shadow-lg outline-none transition-all"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-4 p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Dynamic Content Area */}
            <div className="w-full mt-8">
              <AnimatePresence mode="wait">
                
                {/* State 1: Suggestions */}
                {!isThinking && !showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider ml-1">
                      Suggested Prompts
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {SUGGESTIONS.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(suggestion);
                            // Optional: auto-search on click
                            // handleSearch(); 
                          }}
                          className="px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 transition-all text-sm text-secondary-foreground flex items-center gap-2"
                        >
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* State 2: AI Thinking */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <div className="relative w-16 h-16">
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-primary/30"
                      />
                      <motion.span
                        className="absolute inset-0 rounded-full border-4 border-t-primary"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <p className="text-lg font-medium animate-pulse text-primary">
                      AI is analyzing your request...
                    </p>
                  </motion.div>
                )}

                {/* State 3: Results (Roadmap Card) */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    <div className="bg-card border rounded-2xl p-6 shadow-xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                      
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Frontend Developer Roadmap</h2>
                          <p className="text-muted-foreground">
                            Customized for: <span className="font-medium text-foreground">"{query}"</span>
                          </p>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          Estimated: 3 Months
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { title: "HTML & CSS Fundamentals", duration: "2 Weeks", status: "Start Here" },
                          { title: "JavaScript Deep Dive", duration: "4 Weeks", status: "Next" },
                          { title: "React & Ecosystem", duration: "6 Weeks", status: "Locked" }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-background flex items-center justify-center border group-hover:border-primary transition-colors">
                              <span className="font-bold text-muted-foreground group-hover:text-primary">{i + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">{step.duration}</p>
                            </div>
                            <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                          Start Learning Path
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
