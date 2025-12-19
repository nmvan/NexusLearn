import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle, 
  PlayCircle, 
  Lock, 
  Menu,
  MessageSquare,
  Code,
  FileText,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../context/VideoContext';

// Updated Data to match the "React Mastery" context of the application
const COURSE_DATA = {
  title: "React Mastery: The Complete Guide",
  skill: "Frontend Development",
  completedSections: 2,
  totalSections: 12,
  rating: 4.9, 
  sections: [
    {
      id: 1,
      title: "Section 1: Introduction & Setup",
      rating: 5,
      lessons: [
        { id: 101, title: "Welcome to the Course", duration: "02:30", status: "completed", type: "video" },
        { id: 102, title: "Setting up the Environment", duration: "05:00", status: "completed", type: "video" },
        { id: 103, title: "Course Resources", duration: "1 min", status: "completed", type: "resource" }
      ]
    },
    {
      id: 2,
      title: "Section 2: React Basics & Components",
      rating: 4.8,
      lessons: [
        { id: 201, title: "Understanding Components", duration: "10:00", status: "current", type: "video" },
        { id: 202, title: "JSX Syntax Deep Dive", duration: "08:15", status: "locked", type: "video" },
        { id: 203, title: "Props & State Overview", duration: "12:30", status: "locked", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Section 3: State Management",
      rating: 4.9,
      lessons: [
        { id: 301, title: "useState Hook", duration: "15:00", status: "locked", type: "video" },
        { id: 302, title: "Complex State Logic", duration: "20:00", status: "locked", type: "video" }
      ]
    }
  ]
};

const LESSON_CONTENT = [
  { time: "00:08", title: "Introduction to React Components" },
  { time: "01:44", title: "Functional vs Class Components" },
  { time: "04:10", title: "Your First Component" },
  { time: "05:37", title: "Importing and Exporting" },
  { time: "08:20", title: "Component Hierarchy" }
];

export function LessonView() {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { setVideoTarget } = useVideo();
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (portalRef.current) {
      setVideoTarget(portalRef.current);
    }
    return () => setVideoTarget(null);
  }, [setVideoTarget]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col overflow-hidden shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800">
            <button 
                onClick={() => setSidebarOpen(false)} 
                className="flex items-center text-indigo-400 text-sm font-medium mb-4 hover:text-indigo-300 gap-1 transition-colors"
            >
                <ChevronLeft size={16} /> Hide Course Content
            </button>
            <h2 className="font-bold text-lg mb-1 text-white">{COURSE_DATA.title}</h2>
            <p className="text-xs text-slate-400 mb-2">Frontend Development Path</p>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded font-medium flex items-center gap-1 border border-indigo-500/20">
                    <Code size={12} /> {COURSE_DATA.skill}
                </span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Completed {COURSE_DATA.completedSections}/{COURSE_DATA.totalSections} Sections</span>
                <div className="flex items-center text-yellow-400 text-xs font-bold gap-1">
                    <Star size={14} fill="currentColor" /> {COURSE_DATA.rating}/5
                </div>
            </div>
        </div>

        {/* Sidebar Content (List) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {COURSE_DATA.sections.map(section => (
                <div key={section.id} className="mb-1">
                    <div className="px-4 py-3 bg-slate-800/50 border-l-4 border-transparent hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            {section.id === 2 ? (
                                <div className="bg-indigo-500 rounded-full p-0.5 w-4 h-4 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">!</span>
                                </div>
                            ) : (
                                <CheckCircle size={14} className="text-emerald-500" />
                            )}
                            <h3 className="font-semibold text-sm text-slate-200">{section.title}</h3>
                        </div>
                    </div>
                    <div>
                        {section.lessons.map(lesson => (
                            <div 
                                key={lesson.id} 
                                className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-800/50 cursor-pointer border-l-4 transition-all ${
                                    lesson.status === 'current' 
                                        ? 'bg-indigo-500/10 border-indigo-500' 
                                        : 'border-transparent border-l-slate-800'
                                }`}
                            >
                                <div className="mt-1 shrink-0">
                                    {lesson.status === 'completed' && <CheckCircle size={16} className="text-emerald-500" />}
                                    {lesson.status === 'current' && <PlayCircle size={16} className="text-indigo-400" />}
                                    {lesson.status === 'locked' && <Lock size={16} className="text-slate-600" />}
                                </div>
                                <div>
                                    <p className={`text-sm leading-tight mb-1 ${
                                        lesson.status === 'current' ? 'font-semibold text-indigo-300' : 'text-slate-400'
                                    }`}>
                                        {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            {lesson.type === 'resource' ? <FileText size={10} /> : <PlayCircle size={10} />}
                                            {lesson.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            Progress is automatically saved
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-950 relative">
        {/* Top Navigation */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-950/95 backdrop-blur z-20">
            <div className="flex items-center gap-2 text-sm text-slate-400">
                {!isSidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)} className="mr-2 p-1 hover:bg-slate-800 rounded text-slate-400 transition-colors">
                        <Menu size={20} />
                    </button>
                )}
                <span className="font-medium hover:text-slate-200 cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="font-medium text-slate-200">React Basics</span>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="text-indigo-400 truncate max-w-[200px] sm:max-w-md">Understanding Components</span>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-lg hover:bg-slate-900">
                    <MessageSquare size={16} /> Discuss
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20">
                    Next Lesson <ChevronRight size={16} />
                </button>
            </div>
        </div>

        {/* Video Area - Placeholder for Global Player */}
        <div
            id="video-portal-root"
            ref={portalRef}
            className="w-full aspect-video bg-slate-900 border-b border-slate-800"
        />

        {/* Lesson Content Info */}
        <div className="p-6 max-w-5xl mx-auto w-full pb-24">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors group">
                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Lesson Content</h2>
                    <ChevronRight size={20} className="rotate-90 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-800">
                    <Download size={14} /> Resources
                </button>
            </div>
            
            <div className="space-y-2 mb-8">
                {LESSON_CONTENT.map((item, index) => (
                    <div key={index} className="flex gap-4 text-sm group cursor-pointer hover:bg-slate-900 p-3 rounded-lg border border-transparent hover:border-slate-800 transition-all">
                        <span className="font-mono text-indigo-400 min-w-[45px] bg-indigo-500/10 px-1.5 py-0.5 rounded text-center">{item.time}</span>
                        <span className="text-slate-300 group-hover:text-white font-medium">{item.title}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                <h3 className="text-sm font-semibold text-indigo-300 mb-2">Instructor Note</h3>
                <p className="text-sm text-slate-400 italic">
                    "Don't worry if the syntax looks strange at first. We will practice this pattern many times throughout the course. Focus on understanding the concept of reusability."
                </p>
            </div>
        </div>

        {/* AI Assistant Button */}
        <button className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-full shadow-xl shadow-indigo-600/20 flex items-center gap-3 transition-all hover:scale-105 z-50 group border border-indigo-400/20">
            <div className="bg-white/10 p-1.5 rounded-full group-hover:rotate-12 transition-transform">
                <MessageSquare size={18} className="text-white" />
            </div>
            <span className="font-bold pr-1">Nexus AI Tutor</span>
        </button>
      </div>
    </div>
  );
}
