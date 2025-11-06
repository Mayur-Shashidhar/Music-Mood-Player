"use client";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Music2, Heart, Maximize2, VolumeX, Volume1, Minimize2, MoreHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Track } from "@/data/tracks";

interface Mood {
  name: string;
  gradient: string;
  bgColor: string;
  description: string;
}

interface PlayerProps {
  currentTrack: Track | null;
  mood: Mood;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  isShuffled: boolean;
  onShuffleToggle: (shouldShuffle: boolean) => void;
  repeatMode: number;
  onRepeatModeChange: (mode: number) => void;
  shouldAutoPlay: boolean;
  onAutoPlayHandled: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
}

export default function Player({ 
  currentTrack, 
  mood, 
  onNextTrack, 
  onPreviousTrack,
  isShuffled,
  onShuffleToggle,
  repeatMode,
  onRepeatModeChange,
  shouldAutoPlay,
  onAutoPlayHandled,
  isLiked,
  onToggleLike
}: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Convert duration string (e.g., "3:45") to seconds
  const durationToSeconds = (duration: string) => {
    const [mins, secs] = duration.split(':').map(Number);
    return mins * 60 + secs;
  };

  const totalDuration = currentTrack ? durationToSeconds(currentTrack.duration) : 225;

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            // Automatically play next track when current track ends
            onNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack, totalDuration, onNextTrack]);

  // Update progress bar
  useEffect(() => {
    setProgress((currentTime / totalDuration) * 100);
  }, [currentTime, totalDuration]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        const duration = audioRef.current.duration || totalDuration;
        setProgress((audioRef.current.currentTime / duration) * 100);
      }
    });

    audioRef.current.addEventListener('ended', () => {
      if (repeatMode === 2) {
        // Repeat one - replay the same track
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      } else {
        onNextTrack();
      }
    });

    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setCurrentTime(0);
      }
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [onNextTrack, repeatMode]);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = currentTrack.audio || currentTrack.preview || currentTrack.audioDownload;
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        // Auto-play if requested or if already playing
        if (shouldAutoPlay || isPlaying) {
          setIsPlaying(true);
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
            setIsPlaying(false);
          });
          
          // Reset autoplay flag after handling
          if (shouldAutoPlay) {
            onAutoPlayHandled();
          }
        }
      }
    }
  }, [currentTrack, shouldAutoPlay]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    const newTime = (newProgress / 100) * totalDuration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} className="text-zinc-400" />;
    if (volume < 50) return <Volume1 size={18} className="text-zinc-400" />;
    return <Volume2 size={18} className="text-zinc-400" />;
  };

  return (
    <>
      {/* Expanded Full Screen Player */}
      {isExpanded && currentTrack && (
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 via-black to-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Minimize2 size={24} />
            </button>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Now Playing</h2>
            <button className="text-zinc-400 hover:text-white transition-colors">
              <MoreHorizontal size={24} />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
            {/* Album Art */}
            <div className={`w-96 h-96 bg-gradient-to-br ${mood.gradient} rounded-2xl shadow-2xl mb-12 overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
              {currentTrack.image ? (
                <img 
                  src={currentTrack.image} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center');
                      parent.innerHTML = '<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/80"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 size={120} className="text-white/80" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="text-center mb-8 max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">{currentTrack.title}</h1>
              <p className="text-2xl text-zinc-400">{currentTrack.artist}</p>
              {currentTrack.album && (
                <p className="text-lg text-zinc-500 mt-2">{currentTrack.album}</p>
              )}
            </div>

            {/* Like Button */}
            <button 
              onClick={onToggleLike}
              className="mb-8"
              disabled={!currentTrack}
            >
              <Heart 
                size={32} 
                className={`transition-all ${isLiked ? 'fill-green-500 text-green-500 scale-110' : 'text-zinc-400 hover:text-white hover:scale-110'}`}
              />
            </button>

            {/* Progress Bar */}
            <div className="w-full max-w-3xl mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400 w-12 text-right">{formatTime(currentTime)}</span>
                <div className="flex-1 group">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:w-4 
                      [&::-webkit-slider-thumb]:h-4 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-webkit-slider-track]:bg-zinc-700
                      [&::-webkit-slider-track]:rounded-full"
                    style={{
                      background: `linear-gradient(to right, white ${progress}%, rgb(63 63 70) ${progress}%)`
                    }}
                  />
                </div>
                <span className="text-sm text-zinc-400 w-12">{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mb-8">
              <button 
                onClick={() => onShuffleToggle(!isShuffled)}
                className={`transition-all ${isShuffled ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-white hover:scale-110'}`}
              >
                <Shuffle size={24} />
              </button>
              <button 
                onClick={onPreviousTrack}
                className="text-zinc-400 hover:text-white hover:scale-110 transition-all"
              >
                <SkipBack size={32} fill="currentColor" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white hover:scale-110 flex items-center justify-center transition-all shadow-2xl"
              >
                {isPlaying ? (
                  <Pause size={32} className="text-black" fill="currentColor" />
                ) : (
                  <Play size={32} className="text-black ml-1" fill="currentColor" />
                )}
              </button>
              <button 
                onClick={onNextTrack}
                className="text-zinc-400 hover:text-white hover:scale-110 transition-all"
              >
                <SkipForward size={32} fill="currentColor" />
              </button>
              <button 
                onClick={() => onRepeatModeChange((repeatMode + 1) % 3)}
                className={`transition-all relative ${repeatMode > 0 ? 'text-green-500 scale-110' : 'text-zinc-400 hover:text-white hover:scale-110'}`}
              >
                <Repeat size={24} />
                {repeatMode === 2 && <span className="text-xs absolute -bottom-1 left-1/2 -translate-x-1/2">1</span>}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4 w-96">
              <button onClick={() => setVolume(volume === 0 ? 70 : 0)} className="text-zinc-400 hover:text-white transition-colors flex-shrink-0">
                {volume === 0 ? <VolumeX size={24} /> : volume < 50 ? <Volume1 size={24} /> : <Volume2 size={24} />}
              </button>
              <div className="flex-1 group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-4 
                    [&::-webkit-slider-thumb]:h-4 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-track]:bg-zinc-700
                    [&::-webkit-slider-track]:rounded-full"
                  style={{
                    background: `linear-gradient(to right, white ${volume}%, rgb(63 63 70) ${volume}%)`
                  }}
                />
              </div>
              <span className="text-sm text-zinc-400 w-14 text-right flex-shrink-0">{volume}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Compact Bottom Player */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Now Playing Info */}
          <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
            <div 
              onClick={() => currentTrack && setIsExpanded(true)}
              className={`w-14 h-14 bg-gradient-to-br ${mood.gradient} rounded flex-shrink-0 shadow-lg overflow-hidden ${isPlaying ? 'animate-pulse' : ''} ${currentTrack ? 'cursor-pointer hover:scale-105' : ''} transition-transform`}
            >
              {currentTrack?.image ? (
                <img 
                  src={currentTrack.image} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('flex', 'items-center', 'justify-center');
                      parent.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 size={24} className="text-white" />
                </div>
              )}
            </div>
            <div 
              onClick={() => currentTrack && setIsExpanded(true)}
              className={`flex-1 min-w-0 ${currentTrack ? 'cursor-pointer' : ''}`}
            >
              <div className={`text-sm font-medium truncate ${currentTrack ? 'text-white hover:underline' : 'text-zinc-500'}`}>
                {currentTrack?.title || "No track selected"}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {currentTrack?.artist || "Choose a song to play"}
              </div>
            </div>
            <button 
              onClick={onToggleLike}
              className="flex-shrink-0"
              disabled={!currentTrack}
            >
              <Heart 
                size={18} 
                className={`transition-colors ${isLiked ? 'fill-green-500 text-green-500' : currentTrack ? 'text-zinc-400 hover:text-white' : 'text-zinc-600'}`}
              />
            </button>
          </div>

        {/* Center: Player Controls */}
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-[722px]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onShuffleToggle(!isShuffled)}
              className={`transition-colors ${isShuffled ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
            >
              <Shuffle size={18} />
            </button>
            <button 
              onClick={onPreviousTrack}
              className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!currentTrack}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${
                currentTrack 
                  ? 'bg-white hover:scale-105' 
                  : 'bg-zinc-700 cursor-not-allowed'
              }`}
            >
              {isPlaying ? (
                <Pause size={20} className={currentTrack ? 'text-black' : 'text-zinc-500'} fill="currentColor" />
              ) : (
                <Play size={20} className={`${currentTrack ? 'text-black' : 'text-zinc-500'} ml-0.5`} fill="currentColor" />
              )}
            </button>
            <button 
              onClick={onNextTrack}
              className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
            <button 
              onClick={() => onRepeatModeChange((repeatMode + 1) % 3)}
              className={`transition-colors ${repeatMode > 0 ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
            >
              <Repeat size={18} />
              {repeatMode === 2 && <span className="text-[10px] absolute">1</span>}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-zinc-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 group">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                disabled={!currentTrack}
                className={`w-full h-1 bg-zinc-600 rounded-full appearance-none ${currentTrack ? 'cursor-pointer' : 'cursor-not-allowed'}
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-3 
                  [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:opacity-0
                  group-hover:[&::-webkit-slider-thumb]:opacity-100
                  [&::-webkit-slider-track]:bg-zinc-600
                  [&::-webkit-slider-track]:rounded-full`}
                style={{
                  background: currentTrack 
                    ? `linear-gradient(to right, white ${progress}%, rgb(82 82 91) ${progress}%)`
                    : 'rgb(82 82 91)'
                }}
              />
            </div>
            <span className="text-xs text-zinc-400 w-10">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Right: Volume Control */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
          <button 
            onClick={() => currentTrack && setIsExpanded(true)}
            disabled={!currentTrack}
            className={`transition-colors ${currentTrack ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 cursor-not-allowed'}`}
          >
            <Maximize2 size={18} />
          </button>
          <button onClick={() => setVolume(volume === 0 ? 70 : 0)} className="hover:text-white transition-colors">
            {getVolumeIcon()}
          </button>
          <div className="w-24 group">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-zinc-600 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:opacity-0
                group-hover:[&::-webkit-slider-thumb]:opacity-100
                [&::-webkit-slider-track]:bg-zinc-600
                [&::-webkit-slider-track]:rounded-full"
              style={{
                background: `linear-gradient(to right, white ${volume}%, rgb(82 82 91) ${volume}%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
