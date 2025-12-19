import React, { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';

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
  isActive: boolean;
  closeVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoTarget, setVideoTarget] = useState<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  // We use a mutable ref to hold the video element so we can control it
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const registerVideoRef = useCallback((ref: React.RefObject<HTMLVideoElement | null>) => {
    if (ref.current) {
        setVideoElement(ref.current);
        setIsActive(true);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      videoElement.play().catch((error) => {
        console.warn('Video playback failed', error);
      });
    } else {
      videoElement.pause();
    }
  }, [videoElement]);

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

  useEffect(() => {
    const element = videoElement;
    if (!element) {
      return;
    }

    const handlePlay = () => {
      setIsPlaying(true);
      setIsActive(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    element.addEventListener('play', handlePlay);
    element.addEventListener('pause', handlePause);
    element.addEventListener('ended', handlePause);

    return () => {
      element.removeEventListener('play', handlePlay);
      element.removeEventListener('pause', handlePause);
      element.removeEventListener('ended', handlePause);
    };
  }, [videoElement]);

  const closeVideo = useCallback(() => {
    if (videoElement) {
      videoElement.pause();
    }
    setIsPlaying(false);
    setIsActive(false);
    setVideoElement(null);
  }, [videoElement]);

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
      setVideoTarget,
      isActive,
      closeVideo
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
