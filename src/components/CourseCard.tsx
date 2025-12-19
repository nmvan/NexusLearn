import { Clock, Calendar, CheckSquare, Sparkles, ArrowRight, Globe, ThumbsUp, Star, Code2 } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  matchScore: number; // 0-100
  lastUpdated: string;
  timeCommitment: string; // e.g., "5 hours/week"
  whatYouWillBuild: string[];
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  language?: string;
  techStack?: string[];
  isBeginnerFriendly?: boolean;
  detailedRating?: number;
  price?: number;
  isSelectedForComparison?: boolean;
  isSelectionMode?: boolean;
  onCompareToggle?: (id: string, checked: boolean) => void;
  className?: string;
}

export function CourseCard({
  id,
  title,
  instructor,
  thumbnailUrl,
  matchScore,
  lastUpdated,
  timeCommitment,
  whatYouWillBuild,
  language,
  techStack,
  isBeginnerFriendly,
  detailedRating,
  price,
  isSelectedForComparison = false,
  isSelectionMode = false,
  onCompareToggle,
  className,
}: CourseCardProps) {
  
  // Determine match score color
  const getMatchColor = (score: number) => {
    // Base classes for Light Mode (AI Semantic)
    const lightMode = "text-indigo-900 bg-sky-100 border-sky-200";
    
    // Dark Mode classes (Original Neon)
    let darkMode = "";
    if (score >= 90) darkMode = "dark:text-emerald-400 dark:border-emerald-400/30 dark:bg-emerald-400/10";
    else if (score >= 70) darkMode = "dark:text-cyan-400 dark:border-cyan-400/30 dark:bg-cyan-400/10";
    else darkMode = "dark:text-amber-400 dark:border-amber-400/30 dark:bg-amber-400/10";
    
    return `${lightMode} ${darkMode}`;
  };

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl transition-all",
      // Light Mode
      "bg-white border border-slate-200 shadow-sm hover:shadow-md hover:shadow-indigo-100 hover:border-indigo-200 hover:bg-indigo-50/30",
      // Dark Mode
      "dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-sm dark:hover:border-indigo-500/50 dark:hover:shadow-lg dark:hover:shadow-indigo-500/10",
      className
    )}>
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        
        {/* AI Match Score Badge */}
        <div className={cn(
          "absolute right-3 top-3 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md",
          getMatchColor(matchScore)
        )}>
          <Sparkles className="h-3 w-3" />
          <span>{matchScore}% Match</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <h3 className="mb-1 text-lg font-semibold text-indigo-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">by {instructor}</p>
          
          {/* Rating and Price */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">${price}</span>
            </div>
            {detailedRating && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-bold">{detailedRating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Transparency */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800/50 px-2 py-1">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Updated: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800/50 px-2 py-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{timeCommitment}</span>
          </div>
          {language && (
            <div className="flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800/50 px-2 py-1">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>Language: {language}</span>
            </div>
          )}
          {techStack && techStack.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800/50 px-2 py-1">
              <Code2 className="h-3.5 w-3.5 text-slate-500" />
              <span>{techStack.join(', ')}</span>
            </div>
          )}
          {isBeginnerFriendly && (
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Beginner Friendly</span>
            </div>
          )}
        </div>

        {/* Outcome-Oriented Section */}
        <div className="mb-6 flex-1">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            What you will build
          </h4>
          <ul className="space-y-2">
            {whatYouWillBuild.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactions */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
          {isSelectionMode ? (
            <label 
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50"
                checked={isSelectedForComparison}
                onChange={(e) => onCompareToggle?.(id, e.target.checked)}
              />
              <span>Select to Compare</span>
            </label>
          ) : (
            <div /> /* Spacer */
          )}
          
          <button className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
