import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useCourses } from '../context/CourseContext';
import { useVideo } from '../context/VideoContext';
import { Download, FileText, Sparkles, Trash2, PlayCircle, ChevronDown, ChevronRight, Search } from 'lucide-react';

export const NoteCentral: React.FC = () => {
  const navigate = useNavigate();
  const { notes, deleteNote } = useNotes();
  const { courses } = useCourses();
  const { seekTo } = useVideo();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const knownNoteIds = useRef<Set<string>>(new Set());
  const hasSyncedInitialNotes = useRef(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered notes by courseId
  const notesByCourse = filteredNotes.reduce((acc, note) => {
    const courseId = note.courseId || 'uncategorized';
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(note);
    return acc;
  }, {} as Record<string, typeof filteredNotes>);

  // Auto-expand courses that have filtered notes when searching
  const effectiveExpandedCourses = searchTerm.trim()
    ? new Set(Object.keys(notesByCourse))
    : expandedCourses;

  // Get course title by id
  const getCourseTitle = (courseId: string) => {
    if (courseId === 'uncategorized') return 'Uncategorized';
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : `Course ${courseId}`;
  };

  // Select first note if none selected or if current selection is not in filtered results
  useEffect(() => {
    if (filteredNotes.length > 0 && (!selectedNoteId || !filteredNotes.find(note => note.id === selectedNoteId))) {
      setSelectedNoteId(filteredNotes[0].id);
    }
  }, [filteredNotes, selectedNoteId]);

  useEffect(() => {
    if (!hasSyncedInitialNotes.current) {
      knownNoteIds.current = new Set(notes.map(note => note.id));
      hasSyncedInitialNotes.current = true;
      return;
    }

    const previousIds = knownNoteIds.current;
    const newNote = notes.find(note => !previousIds.has(note.id));

    if (newNote) {
      // Surface the latest note immediately so the My Notes view stays in sync.
      setSelectedNoteId(newNote.id);
      setExpandedCourses(prev => {
        const updated = new Set(prev);
        updated.add(newNote.courseId ?? 'uncategorized');
        return updated;
      });
    }

    knownNoteIds.current = new Set(notes.map(note => note.id));
  }, [notes]);

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const handleExportMarkdown = () => {
    const content = notes.map(note => {
      const courseTitle = getCourseTitle(note.courseId || 'uncategorized');
      return `## ${courseTitle}\n### ${note.title} at ${formatTime(note.timestamp)}\n\n${note.content}\n\n---\n`;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course-notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTimestampClick = (timestamp: number) => {
    navigate('/dashboard/lesson');
    // Small delay to ensure navigation completes before seeking
    setTimeout(() => seekTo(timestamp), 100);
  };

  const handleSummarize = () => {
    setIsSummarizing(true);
    // Mock AI Summary
    setTimeout(() => {
      setSummary("## Course Summary\n\nBased on your collected notes, here is a summary of the key concepts:\n\n- **Context Switching**: The process of storing the state of a process or thread, so that it can be restored and resume execution at a later point.\n- **Multitasking**: Allows multiple processes to share a single CPU.\n- **PCB (Process Control Block)**: Data structure used by computer operating systems to store all the information about a process.\n- **Responsiveness vs Throughput**: The trade-off between how fast a system responds to user input versus the total amount of work done over time.");
      setIsSummarizing(false);
    }, 2000);
  };

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notes</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select a note to view</p>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {Object.keys(notesByCourse).length === 0 ? (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notes yet</p>
            </div>
          ) : (
            Object.entries(notesByCourse).map(([courseId, courseNotes]) => (
              <div key={courseId} className="border-b border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => toggleCourseExpansion(courseId)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {getCourseTitle(courseId)}
                  </span>
                  {effectiveExpandedCourses.has(courseId) ? (
                    <ChevronDown size={16} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-400" />
                  )}
                </button>
                
                {effectiveExpandedCourses.has(courseId) && (
                  <div className="bg-slate-50 dark:bg-slate-900/50">
                    {courseNotes.map((note) => (
                      <button
                        key={note.id}
                        onClick={() => setSelectedNoteId(note.id)}
                        className={`w-full px-6 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          selectedNoteId === note.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-r-2 border-indigo-500' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {note.title}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                          <button 
                            onClick={() => navigate('/dashboard/lesson')}
                            className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                          >
                            <span>Understanding Components</span>
                          </button>
                          
                          <ChevronRight size={14} className="text-slate-600" />
                          <button 
                            onClick={() => handleTimestampClick(note.timestamp)}
                            className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                          >
                            <PlayCircle size={12} />
                            <span>{formatTime(note.timestamp)}</span>
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {selectedNote ? selectedNote.title : 'NoteCentral'}
              </h1>
              {selectedNote && (
                <div className="flex items-center space-x-2 mt-1">
                  <button 
                    onClick={() => navigate('/dashboard/lesson')}
                    className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <span className="text-sm">
                      {getCourseTitle(selectedNote.courseId || 'uncategorized')}
                    </span>
                  </button>

                  <ChevronRight size={14} className="text-slate-600" />
                  <button 
                    onClick={() => navigate('/dashboard/lesson')}
                    className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <span className="text-sm">React Basics</span>
                  </button>
                  <ChevronRight size={14} className="text-slate-600" />
                  <button 
                    onClick={() => navigate('/dashboard/lesson')}
                    className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <span className="text-sm">Understanding Components</span>
                  </button>
                  <ChevronRight size={14} className="text-slate-600" />
                  <button 
                    onClick={() => handleTimestampClick(selectedNote.timestamp)}
                    className="flex items-center space-x-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <PlayCircle size={14} />
                    <span>{formatTime(selectedNote.timestamp)}</span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSummarize}
                disabled={notes.length === 0 || isSummarizing}
                className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Sparkles size={16} />
                <span>{isSummarizing ? 'Summarizing...' : 'AI Summary'}</span>
              </button>
              <button
                onClick={handleExportMarkdown}
                disabled={notes.length === 0}
                className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {summary && (
            <div className="mb-6 p-4 bg-sky-50 dark:bg-slate-900/50 border-l-4 border-indigo-500 dark:border-indigo-500/30 rounded-r-xl backdrop-blur-sm shadow-sm">
              <div className="flex items-center space-x-2 mb-3 text-indigo-900 dark:text-indigo-400">
                <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-semibold">AI Summary</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-900 dark:text-slate-300 leading-relaxed text-sm">
                  {summary}
                </div>
              </div>
            </div>
          )}

          {selectedNote ? (
            <div className="bg-white h-full dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-900 dark:text-slate-300 leading-relaxed">
                  {selectedNote.content}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Created: {selectedNote.createdAt.toLocaleDateString()}
                </span>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
              <p className="text-lg font-medium text-slate-900 dark:text-slate-200">Select a note to view</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose a note from the sidebar to see its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
