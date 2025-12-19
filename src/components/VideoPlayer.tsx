import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';
import { useVideo } from '../context/VideoContext';

interface VideoPlayerProps {
  src: string;
  className?: string;
  forcePip?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className, forcePip = false }) => {
  const { 
    isPlaying, 
    isMuted, 
    togglePlay, 
    toggleMute, 
    handleTimeUpdate: onTimeUpdate, 
    registerVideoRef,
    seekTo
  } = useVideo();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollPip, setIsScrollPip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
    if (videoRef.current) {
        registerVideoRef(videoRef);
    }
  }, [registerVideoRef]);

  // Handle scroll for auto-PIP (only if not forced)
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && !forcePip) {
        const rect = containerRef.current.getBoundingClientRect();
        const shouldBePip = rect.bottom < 0;
        setIsScrollPip(shouldBePip);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forcePip]);

  const isPip = forcePip || isScrollPip;

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
        onClosePip={() => {
            if (forcePip) {
                // Cannot close forced PIP (it's view-dependent)
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }}
    />
  );

  const dashboardAnchor = typeof document !== 'undefined' ? document.getElementById('dashboard-video-anchor') : null;

  if (!domReady) return null;

  if (isPip) {
      return createPortal(
        <div className="fixed bottom-6 right-6 w-80 aspect-video bg-slate-900 rounded-lg shadow-2xl border border-indigo-500/30 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            {VideoContentElement}
        </div>,
        document.body
      );
  }

  if (dashboardAnchor) {
      return createPortal(
          <div ref={containerRef} className={cn("relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800", className)}>
              {VideoContentElement}
          </div>,
          dashboardAnchor
      );
  }

  return (
      <div className="hidden">
          {VideoContentElement}
      </div>
  );
};

const VideoContent = ({ 
    videoRef, src, isPlaying, isMuted, handleTimeUpdate, togglePlay, toggleMute, progress, handleSeek, isPipMode, onClosePip 
}: any) => (
    <div className="relative w-full h-full group">
        <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            muted={isMuted}
            loop
        />
        
        {/* Controls Overlay */}
        <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity flex flex-col justify-end p-4",
            isPipMode ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
            {/* Progress Bar */}
            <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 mb-4"
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
                    <button onClick={onClosePip} className="text-white hover:text-indigo-400 transition-colors" title="Back to top">
                        <Maximize2 size={16} />
                    </button>
                )}
            </div>
        </div>
    </div>
);


