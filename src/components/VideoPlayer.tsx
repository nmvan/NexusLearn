import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useVideo } from '../context/VideoContext';

interface VideoPlayerProps {
  src: string;
  className?: string;
  isMiniPlayer?: boolean;
}

const VideoContent = ({ 
    videoRef, src, isPlaying, isMuted, handleTimeUpdate, togglePlay, toggleMute, progress, handleSeek, isPipMode, onClosePip 
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center pl-2 group-hover:bg-white/20 transition-all shadow-2xl">
                    <Play size={40} className="text-white fill-white" />
                </div>
            </div>
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
            />
            
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-colors">
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-indigo-400 transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
                {isPipMode && (
                    <button onClick={onClosePip} className="text-white hover:text-indigo-400 transition-colors" title="Restore video">
                        <Maximize2 size={16} />
                    </button>
                )}
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
    currentTime
  } = useVideo();

  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [isPip, setIsPip] = useState(false);

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
      const video = videoRef.current;
      if (video) {
          registerVideoRef(videoRef);
          if (Math.abs(video.currentTime - currentTime) > 0.5) {
              video.currentTime = currentTime;
          }
          if (isPlaying && video.paused) {
              video.play().catch(e => console.log("Autoplay prevented", e));
          }
      }
  }, [mountNode, registerVideoRef]); 

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
        onClosePip={() => navigate('/dashboard/lesson')}
    />
  );

  if (!mountNode) return null;

  if (isPip) {
      return createPortal(
        <div className="fixed bottom-6 right-6 w-80 aspect-video bg-slate-900 rounded-lg shadow-2xl border border-indigo-500/30 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden pointer-events-auto">
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


