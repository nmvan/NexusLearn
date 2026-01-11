import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, PictureInPicture2, Play, Pause, Volume2, VolumeX, X, FileText, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useVideo } from '../context/VideoContext';
import { useNotes } from '../context/NotesContext';
import type { Note } from '../context/NotesContext';

interface VideoPlayerProps {
  src: string;
  className?: string;
  isMiniPlayer?: boolean;
}

interface VideoContentProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  src: string;
  isPlaying: boolean;
  isMuted: boolean;
  handleTimeUpdate: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  progress: number;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPipMode: boolean;
  handleNoteTrigger: () => void;
  notes: Note[];
  duration: number;
  toggleFullscreen: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    isFullscreen: boolean;
    onMiniPlayerToggle: () => void;
    isMiniPlayerActive: boolean;
}

const VideoContent: React.FC<VideoContentProps> = ({ 
        videoRef, src, isPlaying, isMuted, handleTimeUpdate, togglePlay, toggleMute, progress, handleSeek, isPipMode, handleNoteTrigger, notes, duration, toggleFullscreen, containerRef, isFullscreen, onMiniPlayerToggle, isMiniPlayerActive 
}) => {
  const [hoveredNote, setHoveredNote] = useState<Note | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [tooltipTop, setTooltipTop] = useState(-80);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustedTooltipLeft = tooltipLeft < 15 ? 15 : tooltipLeft > 85 ? 85 : tooltipLeft;

  useLayoutEffect(() => {
    if (hoveredNote && tooltipRef.current) {
      const height = tooltipRef.current.getBoundingClientRect().height;
      setTooltipTop(-height - 10); // 10px margin from progress bar
    } else {
      setTooltipTop(-80); // default
    }
  }, [hoveredNote]);

    const [videoError, setVideoError] = useState<string | null>(null);

    const handleVideoError = useCallback(() => {
        setVideoError('Video failed to load or play. Please try again.');
    }, []);

    const retryPlayback = useCallback(() => {
        setVideoError(null);
        const el = videoRef.current;
        if (!el) return;
        try {
            el.load();
            // Attempt play only on user gesture; button triggers this
            el.play().catch(() => {
                // Fall back to showing big play button
            });
        } catch {
            // noop
        }
    }, [videoRef]);

    return (
        <div ref={containerRef} className="relative w-full h-full group bg-black cursor-pointer" onClick={togglePlay}>
                <video
                        ref={videoRef}
                        src={src}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleTimeUpdate}
                        onError={handleVideoError}
                        muted={isMuted}
                        loop
                        playsInline
                        crossOrigin="anonymous"
                />
        
        {/* Big Play Button (Centered) */}
        {!isPlaying && (
            <button
                type="button"
                aria-label="Play video"
                className="absolute inset-0 z-20 flex items-center justify-center focus:outline-none"
                onClick={(event) => {
                    event.stopPropagation();
                    togglePlay();
                }}
                data-drag-ignore="true"
            >
                <span className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center pl-2 group-hover:bg-white/20 transition-all shadow-2xl">
                    <Play size={40} className="text-white fill-white" />
                </span>
            </button>
        )}
        
        {/* Controls Overlay */}
        <div 
            className={cn(
                "absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity flex flex-col justify-end p-4 pointer-events-none",
                !isPlaying || isPipMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
        >
            {/* Progress Bar with Markers */}
            <div className="relative w-full mb-4 pointer-events-auto">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress || 0}
                    onChange={handleSeek}
                    className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
                    data-drag-ignore="true"
                />
                {notes.map(note => {
                    const left = duration ? (note.timestamp / duration) * 100 : 0;
                    return (
                        <div
                            key={note.id}
                            className="absolute top-1/2 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2 cursor-pointer hover:bg-indigo-400 transition-colors"
                            style={{ left: `${left}%` }}
                            onMouseEnter={() => {
                                setHoveredNote(note);
                                setTooltipLeft(left);
                            }}
                            onMouseLeave={() => setHoveredNote(null)}
                            data-drag-ignore="true"
                        />
                    );
                })}
                {/* Tooltip */}
                {hoveredNote && (
                    <div ref={tooltipRef} className="absolute bg-slate-800 text-white p-3 rounded-lg shadow-2xl border border-indigo-500/30 max-w-xs z-10 text-sm" style={{ left: `${adjustedTooltipLeft}%`, top: `${tooltipTop}px`, transform: 'translateX(-50%)' }}>
                        <p className="text-gray-300 mb-1">Timestamp: {formatTime(hoveredNote.timestamp)}</p>
                        {hoveredNote.title && <p className="font-semibold mb-1">{hoveredNote.title}</p>}
                        <p>{hoveredNote.content}</p>
                    </div>
                )}
            </div>
            
            <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            togglePlay();
                        }}
                        className="text-white hover:text-indigo-400 transition-colors"
                        data-drag-ignore="true"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleMute();
                        }}
                        className="text-white hover:text-indigo-400 transition-colors"
                        data-drag-ignore="true"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            handleNoteTrigger();
                        }}
                        className="text-white hover:text-indigo-400 transition-colors"
                        data-drag-ignore="true"
                    >
                        <FileText size={20} />
                    </button>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            onMiniPlayerToggle();
                        }}
                        className={cn("text-white hover:text-indigo-400 transition-colors", isMiniPlayerActive && "text-indigo-400")}
                        data-drag-ignore="true"
                        aria-pressed={isMiniPlayerActive}
                        title={isMiniPlayerActive ? "Exit mini player" : "Enter mini player"}
                    >
                        <PictureInPicture2 size={20} />
                    </button>
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            toggleFullscreen();
                        }}
                        className="text-white hover:text-indigo-400 transition-colors"
                        data-drag-ignore="true"
                        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {videoError && (
              <div className="absolute inset-x-0 bottom-20 mx-auto w-fit text-center rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 px-3 py-2 pointer-events-auto">
                <p className="text-sm mb-2">{videoError}</p>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-500"
                  onClick={(e) => { e.stopPropagation(); retryPlayback(); }}
                >
                  Retry
                </button>
              </div>
            )}
        </div>
    </div>
  );
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className }) => {
  const { 
    isPlaying, 
    isMuted, 
    togglePlay, 
    toggleMute, 
    handleTimeUpdate: onTimeUpdate, 
    registerVideoRef,
    seekTo,
        currentTime,
        closeVideo
  } = useVideo();

  const { addNote } = useNotes();
  const { notes: allNotes } = useNotes();
  const notes = allNotes.filter(note => note.courseId === '1');

  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [isPip, setIsPip] = useState(false);
    const [forceMiniPlayer, setForceMiniPlayer] = useState(false);
    const [pipPosition, setPipPosition] = useState<{ x: number; y: number } | null>(null);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [wasPlaying, setWasPlaying] = useState(false);
    const [noteEditorPosition, setNoteEditorPosition] = useState<{ x: number; y: number } | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const noteEditorDragInfoRef = useRef({
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        hasPointer: false
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dragInfoRef = useRef({
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        hasPointer: false
    });
    const dragThreshold = 5;
    const dragSpeed = 1.25;
    // Keep PiP dimensions and margin centralized for drag calculations.
    const pipMetrics = useRef({ width: 320, height: 180, margin: 16 });

    const toggleFullscreen = useCallback(() => {
        const target = containerRef.current;
        if (!target) {
            return;
        }
        if (!document.fullscreenElement) {
            target.requestFullscreen?.().catch(() => {
                // noop: browser denied fullscreen request
            });
            return;
        }
        if (document.fullscreenElement === target) {
            document.exitFullscreen().catch(() => {
                // noop: browser prevented exit
            });
            return;
        }
        document.exitFullscreen().catch(() => {
            // noop
        });
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === containerRef.current);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        const portalRoot = document.getElementById('video-portal-root');
        if (forceMiniPlayer || !portalRoot) {
            setMountNode(document.body);
            setIsPip(true);
            return;
        }
        setMountNode(portalRoot);
        setIsPip(false);
    }, [location.pathname, forceMiniPlayer]);

    useEffect(() => {
        if (!isPip) {
            setPipPosition(null);
        }
    }, [isPip]);

    const handleMiniPlayerToggle = useCallback(() => {
        if (forceMiniPlayer) {
            setForceMiniPlayer(false);
            return;
        }
        const portalRoot = document.getElementById('video-portal-root');
        if (portalRoot) {
            setForceMiniPlayer(true);
        }
    }, [forceMiniPlayer]);

    const handleRestoreFromMiniPlayer = useCallback(() => {
        const portalRoot = document.getElementById('video-portal-root');
        if (portalRoot) {
            setForceMiniPlayer(false);
            return;
        }
        navigate('/dashboard/lesson');
    }, [navigate]);

    const handleCloseVideo = useCallback(() => {
        setForceMiniPlayer(false);
        closeVideo();
    }, [closeVideo]);

        const shouldIgnoreDrag = useCallback((target: EventTarget | null) => {
                return target instanceof HTMLElement && target.closest('[data-drag-ignore="true"]');
        }, []);

    useEffect(() => {
        if (isPip && pipPosition === null && typeof window !== 'undefined') {
            const { width, height, margin } = pipMetrics.current;
            setPipPosition({
                x: Math.max(margin, window.innerWidth - width - margin),
                y: Math.max(margin, window.innerHeight - height - margin)
            });
        }
    }, [isPip, pipPosition]);

    const handleNoteTrigger = () => {
        setWasPlaying(isPlaying);
        if (isPlaying) {
            togglePlay();
        }
        if (!noteEditorPosition && typeof window !== 'undefined') {
            setNoteEditorPosition({
                x: Math.max(0, window.innerWidth / 2 - 160),
                y: Math.max(0, window.innerHeight / 2 - 100)
            });
        }
        setShowNoteEditor(true);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'e' || e.key === 'E') && e.ctrlKey) {
                e.preventDefault();
                handleNoteTrigger();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, togglePlay]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                toggleFullscreen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleFullscreen]);

    const handlePointerMove = useCallback((event: PointerEvent) => {
        const info = dragInfoRef.current;
        if (!info.hasPointer || !isPip || typeof window === 'undefined') {
            return;
        }

        const rawDx = event.clientX - info.startX;
        const rawDy = event.clientY - info.startY;

        if (!info.isDragging) {
            if (Math.abs(rawDx) < dragThreshold && Math.abs(rawDy) < dragThreshold) {
                return;
            }
            info.isDragging = true;
        }

        const { width, height, margin } = pipMetrics.current;
        const dx = rawDx * dragSpeed;
        const dy = rawDy * dragSpeed;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxX = Math.max(margin, viewportWidth - width - margin);
        const maxY = Math.max(margin, viewportHeight - height - margin);

        const nextX = Math.min(Math.max(info.offsetX + dx, margin), maxX);
        const nextY = Math.min(Math.max(info.offsetY + dy, margin), maxY);

        event.preventDefault();
        setPipPosition({ x: nextX, y: nextY });
    }, [dragSpeed, dragThreshold, isPip]);

    const stopDragging = useCallback(() => {
        const info = dragInfoRef.current;
        info.isDragging = false;
        info.hasPointer = false;
    }, []);

    useEffect(() => {
        if (!isPip) {
            return;
        }

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        };
    }, [handlePointerMove, stopDragging, isPip]);

    const handleDragStart = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!isPip) {
            return;
        }

        if (shouldIgnoreDrag(event.target)) {
            return;
        }

        let resolvedPosition = pipPosition;
        if (!resolvedPosition) {
            if (typeof window === 'undefined') {
                return;
            }
            const { width, height, margin } = pipMetrics.current;
            const fallback = {
                x: Math.max(margin, window.innerWidth - width - margin),
                y: Math.max(margin, window.innerHeight - height - margin)
            };
            setPipPosition(fallback);
            resolvedPosition = fallback;
        }

        const info = dragInfoRef.current;
        info.startX = event.clientX;
        info.startY = event.clientY;
        info.offsetX = resolvedPosition.x;
        info.offsetY = resolvedPosition.y;
        info.isDragging = false;
        info.hasPointer = true;
    }, [isPip, pipPosition, shouldIgnoreDrag]);

    const handleDragEnd = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!isPip) {
            return;
        }
        if (dragInfoRef.current.isDragging) {
            event.preventDefault();
            event.stopPropagation();
        }
        stopDragging();
    }, [isPip, stopDragging]);

    const handleNoteEditorPointerMove = useCallback((event: PointerEvent) => {
        const info = noteEditorDragInfoRef.current;
        if (!info.hasPointer || !showNoteEditor || typeof window === 'undefined') {
            return;
        }

        const rawDx = event.clientX - info.startX;
        const rawDy = event.clientY - info.startY;

        if (!info.isDragging) {
            if (Math.abs(rawDx) < dragThreshold && Math.abs(rawDy) < dragThreshold) {
                return;
            }
            info.isDragging = true;
        }

        const dx = rawDx * dragSpeed;
        const dy = rawDy * dragSpeed;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxX = viewportWidth - 320; // assuming width 320
        const maxY = viewportHeight - 200; // assuming height 200

        const nextX = Math.min(Math.max(info.offsetX + dx, 0), maxX);
        const nextY = Math.min(Math.max(info.offsetY + dy, 0), maxY);

        event.preventDefault();
        setNoteEditorPosition({ x: nextX, y: nextY });
    }, [dragSpeed, dragThreshold, showNoteEditor]);

    const stopNoteEditorDragging = useCallback(() => {
        const info = noteEditorDragInfoRef.current;
        info.isDragging = false;
        info.hasPointer = false;
    }, []);

    useEffect(() => {
        if (!showNoteEditor) {
            return;
        }

        window.addEventListener('pointermove', handleNoteEditorPointerMove);
        window.addEventListener('pointerup', stopNoteEditorDragging);
        window.addEventListener('pointercancel', stopNoteEditorDragging);

        return () => {
            window.removeEventListener('pointermove', handleNoteEditorPointerMove);
            window.removeEventListener('pointerup', stopNoteEditorDragging);
            window.removeEventListener('pointercancel', stopNoteEditorDragging);
        };
    }, [handleNoteEditorPointerMove, stopNoteEditorDragging, showNoteEditor]);

    const handleNoteEditorDragStart = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (shouldIgnoreDrag(event.target)) {
            return;
        }
        if (!showNoteEditor) {
            return;
        }

        let resolvedPosition = noteEditorPosition;
        if (!resolvedPosition) {
            if (typeof window === 'undefined') {
                return;
            }
            const fallback = {
                x: Math.max(0, window.innerWidth / 2 - 160),
                y: Math.max(0, window.innerHeight / 2 - 100)
            };
            setNoteEditorPosition(fallback);
            resolvedPosition = fallback;
        }

        const info = noteEditorDragInfoRef.current;
        info.startX = event.clientX;
        info.startY = event.clientY;
        info.offsetX = resolvedPosition.x;
        info.offsetY = resolvedPosition.y;
        info.isDragging = false;
        info.hasPointer = true;
    }, [showNoteEditor, noteEditorPosition, shouldIgnoreDrag]);

    const handleNoteEditorDragEnd = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!showNoteEditor) {
            return;
        }
        if (noteEditorDragInfoRef.current.isDragging) {
            event.preventDefault();
            event.stopPropagation();
        }
        stopNoteEditorDragging();
    }, [showNoteEditor, stopNoteEditorDragging]);

  useEffect(() => {
      const video = videoRef.current;
      if (video) {
          registerVideoRef(videoRef);
          if (!Number.isNaN(currentTime) && Math.abs(video.currentTime - currentTime) > 0.5) {
              video.currentTime = currentTime;
          }
          if (isPlaying && video.paused) {
              video.play().catch(e => console.log("Autoplay prevented", e));
          }
      }
  }, [mountNode, registerVideoRef, currentTime, isPlaying]); 

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      onTimeUpdate(current);
      setProgress((current / dur) * 100);
      setDuration(dur);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    seekTo(seekTime);
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const insertFormat = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = noteText.substring(start, end);
    const formatted = before + selected + after;
    const newText = noteText.substring(0, start) + formatted + noteText.substring(end);
    setNoteText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const VideoContentElement = (
    <VideoContent 
        videoRef={videoRef}
        src={src}
        isPlaying={isPlaying}
        isMuted={isMuted}
        handleTimeUpdate={handleTimeUpdate}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        progress={progress}
        handleSeek={handleSeek}
                isPipMode={isPip}
                handleNoteTrigger={handleNoteTrigger}
                notes={notes}
                duration={duration}
                toggleFullscreen={toggleFullscreen}
                                containerRef={containerRef}
                                isFullscreen={isFullscreen}
                                onMiniPlayerToggle={handleMiniPlayerToggle}
                                isMiniPlayerActive={isPip}
    />
  );

  if (!mountNode) return null;

  if (isPip) {
            const pipStyle = pipPosition
                ? {
                        top: pipPosition.y,
                        left: pipPosition.x,
                        width: `${pipMetrics.current.width}px`,
                        height: `${pipMetrics.current.height}px`
                    }
                : {
                        bottom: pipMetrics.current.margin,
                        right: pipMetrics.current.margin,
                        width: `${pipMetrics.current.width}px`,
                        height: `${pipMetrics.current.height}px`
                    };

      return createPortal(
        <div
            className="fixed w-80 aspect-video bg-slate-900 rounded-lg shadow-2xl border border-indigo-500/30 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
            style={pipStyle}
            onPointerDown={handleDragStart}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
        >
            <div className="absolute top-2 right-2 flex items-center gap-1 z-30" data-drag-ignore="true">
                <button
                    type="button"
                    className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-100 transition-colors"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleRestoreFromMiniPlayer();
                    }}
                    title="Restore player"
                    data-drag-ignore="true"
                >
                    <Maximize2 size={14} />
                </button>
                <button
                    type="button"
                    className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-100 transition-colors"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleCloseVideo();
                    }}
                    title="Close player"
                    data-drag-ignore="true"
                >
                    <X size={14} />
                </button>
            </div>
            {VideoContentElement}
            {showNoteEditor && (
                <div
                    className="fixed bg-slate-800 text-white p-4 rounded-lg shadow-2xl border border-indigo-500/30 z-50 w-80 cursor-grab active:cursor-grabbing"
                    style={{
                        top: noteEditorPosition?.y || 0,
                        left: noteEditorPosition?.x || 0
                    }}
                >
                    <div className="flex justify-between items-center mb-2 cursor-grab active:cursor-grabbing"
                         onPointerDown={handleNoteEditorDragStart}
                         onPointerUp={handleNoteEditorDragEnd}
                         onPointerCancel={handleNoteEditorDragEnd}>
                        <h3 className="text-lg font-semibold">Add Note</h3>
                        <button
                            data-drag-ignore="true"
                            onClick={() => {
                                setShowNoteEditor(false);
                                setNoteText('');
                                if (wasPlaying) togglePlay();
                            }}
                            className="text-white hover:text-gray-300 text-xl leading-none"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">Timestamp: {formatTime(currentTime)}</p>
                    <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded mb-2"
                        placeholder="Enter note title..."
                    />
                    <div className="flex space-x-1 mb-2">
                        <button onClick={() => insertFormat('**')} className="p-1 text-white hover:bg-slate-600 rounded" title="Bold">
                            <Bold size={16} />
                        </button>
                        <button onClick={() => insertFormat('*')} className="p-1 text-white hover:bg-slate-600 rounded" title="Italic">
                            <Italic size={16} />
                        </button>
                        <button onClick={() => insertFormat('<u>', '</u>')} className="p-1 text-white hover:bg-slate-600 rounded" title="Underline">
                            <Underline size={16} />
                        </button>
                        <button onClick={() => insertFormat('- ')} className="p-1 text-white hover:bg-slate-600 rounded" title="Unordered List">
                            <List size={16} />
                        </button>
                        <button onClick={() => insertFormat('1. ')} className="p-1 text-white hover:bg-slate-600 rounded" title="Ordered List">
                            <ListOrdered size={16} />
                        </button>
                    </div>
                    <textarea
                        ref={textareaRef}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full h-24 p-2 bg-slate-700 text-white border border-slate-600 rounded resize-none"
                        placeholder="Enter your note..."
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={() => {
                                setShowNoteEditor(false);
                                setNoteText('');
                                setNoteTitle('');
                                if (wasPlaying) togglePlay();
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (noteText.trim()) {
                                    const newNote = {
                                        id: Date.now().toString(),
                                        title: noteTitle.trim(),
                                        timestamp: currentTime,
                                        content: noteText.trim(),
                                        createdAt: new Date(),
                                        courseId: '1', // Mock course ID - in a real app, this would come from current course context
                                    };
                                    addNote(newNote);
                                }
                                setShowNoteEditor(false);
                                setNoteText('');
                                setNoteTitle('');
                                if (wasPlaying) togglePlay();
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>,
        mountNode
      );
  }

  return createPortal(
      <div className={cn("w-full h-full", className)}>
          {VideoContentElement}
          {showNoteEditor && (
              <div
                  className="absolute bg-slate-800 text-white p-4 rounded-lg shadow-2xl border border-indigo-500/30 z-50 w-80 cursor-grab active:cursor-grabbing"
                  style={{
                      top: noteEditorPosition?.y || 0,
                      left: noteEditorPosition?.x || 0
                  }}
              >
                  <div className="flex justify-between items-center mb-2 cursor-grab active:cursor-grabbing"
                       onPointerDown={handleNoteEditorDragStart}
                       onPointerUp={handleNoteEditorDragEnd}
                       onPointerCancel={handleNoteEditorDragEnd}>
                      <h3 className="text-lg font-semibold">Add Note</h3>
                      <button
                          data-drag-ignore="true"
                          onClick={() => {
                              setShowNoteEditor(false);
                              setNoteText('');
                              setNoteTitle('');
                              if (wasPlaying) togglePlay();
                          }}
                          className="text-white hover:text-gray-300 text-xl leading-none"
                      >
                          ×
                      </button>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">Timestamp: {formatTime(currentTime)}</p>
                  <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded mb-2"
                      placeholder="Enter note title..."
                  />
                  <div className="flex space-x-1 mb-2">
                      <button onClick={() => insertFormat('**')} className="p-1 text-white hover:bg-slate-600 rounded" title="Bold">
                          <Bold size={16} />
                      </button>
                      <button onClick={() => insertFormat('*')} className="p-1 text-white hover:bg-slate-600 rounded" title="Italic">
                          <Italic size={16} />
                      </button>
                      <button onClick={() => insertFormat('<u>', '</u>')} className="p-1 text-white hover:bg-slate-600 rounded" title="Underline">
                          <Underline size={16} />
                      </button>
                      <button onClick={() => insertFormat('- ')} className="p-1 text-white hover:bg-slate-600 rounded" title="Unordered List">
                          <List size={16} />
                      </button>
                      <button onClick={() => insertFormat('1. ')} className="p-1 text-white hover:bg-slate-600 rounded" title="Ordered List">
                          <ListOrdered size={16} />
                      </button>
                  </div>
                  <textarea
                      ref={textareaRef}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="w-full h-24 p-2 bg-slate-700 text-white border border-slate-600 rounded resize-none"
                      placeholder="Enter your note..."
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                      <button
                          onClick={() => {
                              setShowNoteEditor(false);
                              setNoteText('');
                              setNoteTitle('');
                              if (wasPlaying) togglePlay();
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                          Cancel
                      </button>
                      <button
                          onClick={() => {
                              if (noteText.trim()) {
                                  const newNote = {
                                      id: Date.now().toString(),
                                      title: noteTitle.trim(),
                                      timestamp: currentTime,
                                      content: noteText.trim(),
                                      createdAt: new Date(),
                                      courseId: '1', // Mock course ID - in a real app, this would come from current course context
                                  };
                                  addNote(newNote);
                              }
                              setShowNoteEditor(false);
                              setNoteText('');
                              setNoteTitle('');
                              if (wasPlaying) togglePlay();
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                          Save
                      </button>
                  </div>
              </div>
          )}
      </div>,
      mountNode
  );
};


