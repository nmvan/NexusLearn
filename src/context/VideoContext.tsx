import React, { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react';

interface VideoContextType {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  togglePlay: () => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  handleTimeUpdate: (time: number) => void;
  handleDurationChange: (duration: number) => void;
  registerVideoRef: (ref: React.RefObject<HTMLVideoElement | null>) => void;
  videoTarget: HTMLElement | null;
  setVideoTarget: (target: HTMLElement | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoTarget, setVideoTarget] = useState<HTMLElement | null>(null);
  
  // We use a mutable ref to hold the video element so we can control it
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const registerVideoRef = useCallback((ref: React.RefObject<HTMLVideoElement | null>) => {
    // This is a bit of a hack to sync the ref from the component to the context
    // In a real app, we might just manage the ref here and pass it down
    if (ref.current) {
        setVideoElement(ref.current);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, videoElement]);

  const toggleMute = useCallback(() => {
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted, videoElement]);

  const seekTo = useCallback((time: number) => {
    if (videoElement) {
      videoElement.currentTime = time;
      setCurrentTime(time);
    }
  }, [videoElement]);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handleDurationChange = useCallback((dur: number) => {
    setDuration(dur);
  }, []);

  return (
    <VideoContext.Provider value={{
      currentTime,
      duration,
      isPlaying,
      isMuted,
      videoRef: internalVideoRef, // Not strictly used if we use registerVideoRef logic, but kept for interface
      togglePlay,
      toggleMute,
      seekTo,
      handleTimeUpdate,
      handleDurationChange,
      registerVideoRef,
      videoTarget,
      setVideoTarget
    }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
