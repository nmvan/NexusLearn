import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Award, MoreVertical, Pause, Maximize } from 'lucide-react';

const allInProgressCourses = [
  { 
    id: 1, 
    title: 'React Advanced Patterns', 
    instructor: 'Sarah Drasner',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop',
    progress: 75, 
    totalLessons: 24,
    completedLessons: 18,
    lastAccessed: '2h ago',
    category: 'Frontend',
    currentVideo: {
      title: 'Compound Components Pattern',
      duration: '15:30'
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  { 
    id: 2, 
    title: 'System Design Interview', 
    instructor: 'Alex Xu',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&auto=format&fit=crop',
    progress: 30, 
    totalLessons: 40,
    completedLessons: 12,
    lastAccessed: '1d ago',
    category: 'Backend',
    currentVideo: {
      title: 'Consistent Hashing Explained',
      duration: '22:15'
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  { 
    id: 3, 
    title: 'TypeScript Mastery', 
    instructor: 'Matt Pocock',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=300&auto=format&fit=crop',
    progress: 50, 
    totalLessons: 30,
    completedLessons: 15,
    lastAccessed: '3d ago',
    category: 'Language',
    currentVideo: {
      title: 'Advanced Generics',
      duration: '18:45'
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  { 
    id: 4, 
    title: 'UI/UX Design Fundamentals', 
    instructor: 'Gary Simon',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300&auto=format&fit=crop',
    progress: 10, 
    totalLessons: 15,
    completedLessons: 1,
    lastAccessed: '1w ago',
    category: 'Design',
    currentVideo: {
      title: 'Color Theory Basics',
      duration: '12:00'
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  { 
    id: 5, 
    title: 'Docker & Kubernetes', 
    instructor: 'Nana Janashia',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=300&auto=format&fit=crop',
    progress: 5, 
    totalLessons: 50,
    completedLessons: 2,
    lastAccessed: '2w ago',
    category: 'DevOps',
    currentVideo: {
      title: 'Containerizing a Node App',
      duration: '25:10'
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
];

export function MyCourses() {
  const navigate = useNavigate();

  const CourseVideoCard = ({ course }: { course: typeof allInProgressCourses[0] }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    return (
      <div 
        className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
      >
        <div className="relative h-48 bg-black group-video">
           <video 
             ref={videoRef}
             src={course.videoUrl}
             poster={course.thumbnail}
             className="w-full h-full object-cover"
             onEnded={() => setIsPlaying(false)}
           />
           
           {/* Overlay Controls */}
           <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
             <button 
               onClick={togglePlay}
               className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 transform hover:scale-110"
             >
               {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
             </button>
           </div>

           {/* Bottom Bar (visible on hover or pause) */}
           <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
             <div className="flex justify-between items-center">
               <span className="text-xs text-white font-medium">{course.currentVideo.duration}</span>
               <Maximize className="h-4 w-4 text-white" />
             </div>
             {/* Progress bar for video */}
             <div className="w-full bg-white/20 h-1 rounded-full mt-2 overflow-hidden">
               <div className="bg-indigo-500 h-full w-1/3"></div>
             </div>
           </div>
           
           <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium backdrop-blur-sm">
                  {course.category}
                </span>
           </div>
        </div>

        <div className="p-5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
              {course.title}
            </h3>
            <button className="text-slate-500 hover:text-slate-300">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm text-slate-400 mb-4">{course.instructor}</p>

          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Play className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium uppercase tracking-wider">Current Lesson</span>
            </div>
            <p className="text-sm text-slate-200 font-medium truncate">{course.currentVideo.title}</p>
            <p className="text-xs text-slate-500 mt-1">{course.currentVideo.duration} remaining</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{course.progress}% Complete</span>
              <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Last accessed {course.lastAccessed}</span>
            </div>
            {course.progress >= 100 && (
              <div className="flex items-center gap-1 text-emerald-400">
                <Award className="h-3.5 w-3.5" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Learning</h1>
          <p className="text-slate-400">Continue where you left off</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Last Accessed</option>
            <option>Progress (High to Low)</option>
            <option>Progress (Low to High)</option>
            <option>Recently Enrolled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allInProgressCourses.map((course) => (
          <CourseVideoCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
