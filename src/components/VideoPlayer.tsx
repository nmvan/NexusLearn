import React, { useRef, useEffect, useState } from 'react';
import { Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

interface VideoPlayerProps {
  src: string;
  onTimeUpdate: (currentTime: number) => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onTimeUpdate, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle scroll for auto-PIP
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // If the bottom of the video container is above the top of the viewport, enable PIP
        // We add a small buffer (e.g., 100px) to make it feel natural
        const shouldBePip = rect.bottom < 0;
        setIsPip(shouldBePip);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <>
      {/* Placeholder to hold space when in PIP mode */}
      <div ref={containerRef} className={cn("relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800", className)}>
        {!isPip && (
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Main Video Rendered Here when NOT in PIP */}
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
             />
          </div>
        )}
        {/* If PIP is active, we still keep the container to maintain layout flow, but it's empty or shows a placeholder */}
        {isPip && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                <span className="text-slate-500">Playing in Mini-player...</span>
            </div>
        )}
      </div>

      {/* PIP Video Portal - Rendered Fixed if isPip is true */}
      {isPip && (
        <div className="fixed bottom-6 right-6 w-80 aspect-video bg-slate-900 rounded-lg shadow-2xl border border-indigo-500/30 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
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
                isPipMode={true}
                onClosePip={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
             />
        </div>
      )}
    </>
  );
};

// Helper component to avoid code duplication
const VideoContent = ({ 
    videoRef, src, isPlaying, isMuted, handleTimeUpdate, togglePlay, toggleMute, progress, handleSeek, isPipMode, onClosePip 
}: any) => (
    <div className="relative w-full h-full group">
        <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            autoPlay={isPlaying} // Maintain state when switching modes
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

export default VideoPlayer;
