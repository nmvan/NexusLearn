import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bookmark, Clock, Bot, User, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp?: number; // Video timestamp when the message was sent/generated
  isExplanation?: boolean;
}

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface AISidebarProps {
  currentTime: number;
  className?: string;
}

export const AISidebar: React.FC<AISidebarProps> = ({ currentTime, className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hi Nhat! I'm your context-aware learning assistant. Click 'Explain this concept' anytime to get a deep dive into what's playing.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simple Markdown Parser for Bold and Lists
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Handle Bullet Points
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        return (
          <div key={i} className="flex items-start space-x-2 ml-2 mb-1">
            <span className="text-cyan-400 mt-1.5 text-[10px]">●</span>
            <span className="flex-1">{parseBold(content)}</span>
          </div>
        );
      }
      // Handle Empty Lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      // Handle Normal Text
      return <div key={i} className="mb-1">{parseBold(line)}</div>;
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-cyan-100 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handleExplainClick = async () => {
    const timestamp = currentTime;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `Explain the concept at ${formatTime(timestamp)}`,
      timestamp: timestamp
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Mock AI processing delay
    setTimeout(() => {
      const contextStart = Math.max(0, timestamp - 20);
      const contextEnd = timestamp + 20;
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**Context Analysis (${formatTime(contextStart)} - ${formatTime(contextEnd)}):**\n\nThe instructor is discussing the core principles of **Context Switching** in operating systems.\n\n**Key Takeaways:**\n- The CPU saves the state of a process (**PCB**) before switching.\n- This overhead is critical for **multitasking**.\n- Can impact performance if not optimized.\n\n**Why this matters:**\n- **Efficiency:** Maximizes CPU utilization by keeping it busy.\n- **User Experience:** Enables smooth multitasking between applications.`,
        timestamp: timestamp,
        isExplanation: true
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**Answer:**\n\nThat's a great question. In this specific module, the key takeaway is understanding the trade-off between **responsiveness** and **throughput**.\n\n**Why it matters:**\n- **Responsiveness:** How fast the system reacts.\n- **Throughput:** Total work done per unit time.`,
        timestamp: currentTime
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const saveNote = (message: Message) => {
    if (!message.timestamp) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      timestamp: message.timestamp,
      content: message.content,
      createdAt: new Date()
    };
    
    // setNotes(prev => [...prev, newNote]);
    console.log("Note saved:", newNote);
    // Optional: Show toast or feedback
  };

  return (
    <div className={cn("flex flex-col h-[600px] bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm", className)}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-slate-100">AI Assistant</h3>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          SYNCED: {formatTime(currentTime)}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] rounded-2xl p-3 text-sm relative group",
              msg.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
            )}>
              {/* Message Header (Icon + Time) */}
              <div className="flex items-center space-x-2 mb-1 opacity-70 text-xs">
                {msg.role === 'ai' ? <Bot size={12} /> : <User size={12} />}
                {msg.timestamp !== undefined && (
                  <span className="flex items-center">
                    <Clock size={10} className="mr-1" />
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.role === 'ai' ? renderMarkdown(msg.content) : msg.content}
              </div>

              {/* Actions (Only for AI messages) */}
              {msg.role === 'ai' && (
                <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center text-[10px] text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/50">
                      <PlayCircle size={10} className="mr-1 text-cyan-400" />
                      Show Source
                    </span>
                  </div>
                  <button 
                    onClick={() => saveNote(msg)}
                    className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <Bookmark size={12} />
                    <span>Save to Notes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 border border-slate-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Action Bar */}
      <div className="p-2 bg-slate-900/50 border-t border-slate-800">
        <button
          onClick={handleExplainClick}
          className="w-full py-2 px-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 group"
        >
          <Sparkles size={16} className="group-hover:animate-pulse" />
          <span>Explain this concept ({formatTime(currentTime)})</span>
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};


