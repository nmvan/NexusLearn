import { useState } from 'react';
import { Search, Bell, User, LogOut, CreditCard, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  onNavigate?: (view: 'landing' | 'dashboard' | 'subscription' | 'notes') => void;
  currentView?: 'landing' | 'dashboard' | 'subscription' | 'notes';
}

const Header = ({ onNavigate, currentView }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Area */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate?.('landing')}
        >
          <div className="h-8 w-8 rounded-lg bg-indigo-700 flex items-center justify-center shadow-[0_0_15px_rgba(67,56,202,0.5)]">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-lg font-semibold text-slate-200 hidden md:block">NexusLearn</span>
        </div>

        {/* Search Bar - Hero Element */}
        {currentView !== 'landing' && (
          <div className="flex-1 flex justify-center max-w-3xl mx-4">
            <div className="relative w-full md:w-[60%] group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full opacity-30 group-hover:opacity-70 transition duration-500 blur animate-pulse"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="What do you want to learn today, Nhat?"
                  className={cn(
                    "w-full h-12 pl-12 pr-4 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10",
                    "text-slate-200 placeholder:text-slate-500",
                    "focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent",
                    "transition-all duration-300 ease-in-out",
                    "shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                  )}
                />
                <div className="absolute right-3 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-400 hidden sm:block font-mono">
                  Ctrl + K
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate?.('notes')}
            className="hidden md:block text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors mr-2"
          >
            My Notes
          </button>

          <button className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] focus:outline-none"
            >
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-slate-300" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-medium text-white">Nhat Nguyen</p>
                  <p className="text-xs text-slate-400 truncate">nhat@example.com</p>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={() => {
                      onNavigate?.('subscription');
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Subscription
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-slate-800 py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
