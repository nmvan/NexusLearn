import { Clock, Calendar, CheckSquare, Sparkles, ArrowRight } from 'lucide-react';
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
  isSelectedForComparison?: boolean;
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
  isSelectedForComparison = false,
  onCompareToggle,
  className,
}: CourseCardProps) {
  
  // Determine match score color
  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    if (score >= 70) return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
    return "text-amber-400 border-amber-400/30 bg-amber-400/10";
  };

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10",
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
          <h3 className="mb-1 text-lg font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400">by {instructor}</p>
        </div>

        {/* Metadata Transparency */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 rounded-md bg-slate-800/50 px-2 py-1">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Updated: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-800/50 px-2 py-1">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{timeCommitment}</span>
          </div>
        </div>

        {/* Outcome-Oriented Section */}
        <div className="mb-6 flex-1">
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
            What you will build
          </h4>
          <ul className="space-y-2">
            {whatYouWillBuild.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactions */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50"
              checked={isSelectedForComparison}
              onChange={(e) => onCompareToggle?.(id, e.target.checked)}
            />
            <span>Compare</span>
          </label>
          
          <button className="flex items-center gap-1 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
