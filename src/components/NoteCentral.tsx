import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { useVideo } from '../context/VideoContext';
import { Download, FileText, Sparkles, Trash2, Clock, PlayCircle } from 'lucide-react';

export const NoteCentral: React.FC = () => {
  const { notes, deleteNote } = useNotes();
  const { seekTo } = useVideo();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExportMarkdown = () => {
    const content = notes.map(note => {
      return `### Note at ${formatTime(note.timestamp)}\n\n${note.content}\n\n---\n`;
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

  const handleSummarize = () => {
    setIsSummarizing(true);
    // Mock AI Summary
    setTimeout(() => {
      setSummary("## Course Summary\n\nBased on your collected notes, here is a summary of the key concepts:\n\n- **Context Switching**: The process of storing the state of a process or thread, so that it can be restored and resume execution at a later point.\n- **Multitasking**: Allows multiple processes to share a single CPU.\n- **PCB (Process Control Block)**: Data structure used by computer operating systems to store all the information about a process.\n- **Responsiveness vs Throughput**: The trade-off between how fast a system responds to user input versus the total amount of work done over time.");
      setIsSummarizing(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">NoteCentral</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and review your learning notes</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSummarize}
            disabled={notes.length === 0 || isSummarizing}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={18} />
            <span>{isSummarizing ? 'Summarizing...' : 'Ask AI to Summarize'}</span>
          </button>
          <button
            onClick={handleExportMarkdown}
            disabled={notes.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span>Export to Markdown</span>
          </button>
        </div>
      </div>

      {summary && (
        <div className="mb-8 p-6 bg-sky-50 dark:bg-slate-900/50 border-l-4 border-indigo-500 dark:border-indigo-500/30 rounded-r-xl backdrop-blur-sm shadow-sm">
          <div className="flex items-center space-x-2 mb-4 text-indigo-900 dark:text-indigo-400">
            <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold">AI Summary</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-900 dark:text-slate-300 leading-relaxed">
              {summary}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <FileText size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
            <p className="text-lg font-medium text-slate-900 dark:text-slate-200">No notes collected yet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Save notes from the AI Assistant while watching videos.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-indigo-200 dark:hover:border-slate-700 hover:shadow-sm transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <button 
                    onClick={() => seekTo(note.timestamp)}
                    className="flex items-center space-x-1 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded border border-indigo-100 dark:border-transparent"
                  >
                    <PlayCircle size={14} />
                    <span>{formatTime(note.timestamp)}</span>
                  </button>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 dark:text-slate-500">{note.createdAt.toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="prose prose-invert max-w-none text-slate-900 dark:text-slate-300 text-sm leading-relaxed">
                {note.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
