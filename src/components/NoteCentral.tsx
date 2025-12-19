import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { Download, FileText, Sparkles, Trash2, Clock } from 'lucide-react';

export const NoteCentral: React.FC = () => {
  const { notes, deleteNote } = useNotes();
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
          <h1 className="text-2xl font-bold text-slate-100 mb-2">NoteCentral</h1>
          <p className="text-slate-400">Manage and review your learning notes</p>
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
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span>Export to Markdown</span>
          </button>
        </div>
      </div>

      {summary && (
        <div className="mb-8 p-6 bg-slate-900/50 border border-indigo-500/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4 text-indigo-400">
            <Sparkles size={20} />
            <h2 className="text-lg font-semibold">AI Summary</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
              {summary}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No notes collected yet</p>
            <p className="text-sm">Save notes from the AI Assistant while watching videos.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Clock size={14} />
                  <span>Timestamp: {formatTime(note.timestamp)}</span>
                  <span className="text-slate-600">•</span>
                  <span>{note.createdAt.toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
