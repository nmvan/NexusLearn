import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useVideo } from '../context/VideoContext';

interface VideoPlayerProps {
  src: string;
  className?: string;
  isMiniPlayer?: boolean;
}

const VideoContent = ({ 
    videoRef, src, isPlaying, isMuted, handleTimeUpdate, togglePlay, toggleMute, progress, handleSeek, isPipMode 
}: any) => (
    <div className="relative w-full h-full group bg-black cursor-pointer" onClick={togglePlay}>
        <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            muted={isMuted}
            loop
            playsInline
        />
        
        {/* Big Play Button (Centered) */}
        {!isPlaying && (
            <button
                type="button"
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center focus:outline-none"
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
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity flex flex-col justify-end p-4",
                !isPlaying || isPipMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent togglePlay when clicking controls
        >
            {/* Progress Bar */}
            <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-4 hover:h-2 transition-all"
                data-drag-ignore="true"
            />
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-colors" data-drag-ignore="true">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-indigo-400 transition-colors" data-drag-ignore="true">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

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

  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [isPip, setIsPip] = useState(false);
    const [pipPosition, setPipPosition] = useState<{ x: number; y: number } | null>(null);
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

  useEffect(() => {
    // Check for the portal root in LessonView
    const portalRoot = document.getElementById('video-portal-root');
    
    if (portalRoot) {
      setMountNode(portalRoot);
      setIsPip(false);
    } else {
      // Fallback to body (PIP mode) if playing but not in LessonView
      setMountNode(document.body);
      setIsPip(true);
    }
  }, [location.pathname]); // Re-check on navigation

    useEffect(() => {
        if (!isPip) {
            setPipPosition(null);
        }
    }, [isPip]);

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
      const duration = videoRef.current.duration;
      onTimeUpdate(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    seekTo(seekTime);
    setProgress(parseFloat(e.target.value));
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
                        navigate('/dashboard/lesson');
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
                        closeVideo();
                    }}
                    title="Close player"
                    data-drag-ignore="true"
                >
                    <X size={14} />
                </button>
            </div>
            {VideoContentElement}
        </div>,
        mountNode
      );
  }

  return createPortal(
      <div className={cn("w-full h-full", className)}>
          {VideoContentElement}
      </div>,
      mountNode
  );
};


