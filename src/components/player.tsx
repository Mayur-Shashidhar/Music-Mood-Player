"use client";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Music2, Heart, Maximize2, VolumeX, Volume1 } from "lucide-react";
import { useState, useEffect } from "react";
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
}

export default function Player({ currentTrack, mood, onNextTrack, onPreviousTrack }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

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

  // Reset when track changes
  useEffect(() => {
    if (currentTrack) {
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    setCurrentTime((newProgress / 100) * totalDuration);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} className="text-zinc-400" />;
    if (volume < 50) return <Volume1 size={18} className="text-zinc-400" />;
    return <Volume2 size={18} className="text-zinc-400" />;
  };

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Now Playing Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
          <div className={`w-14 h-14 bg-gradient-to-br ${mood.gradient} rounded flex items-center justify-center flex-shrink-0 shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}>
            <Music2 size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium truncate ${currentTrack ? 'text-white' : 'text-zinc-500'}`}>
              {currentTrack?.title || "No track selected"}
            </div>
            <div className="text-xs text-zinc-400 truncate">
              {currentTrack?.artist || "Choose a song to play"}
            </div>
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)}
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
              onClick={() => setIsShuffled(!isShuffled)}
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
              onClick={() => setRepeatMode((repeatMode + 1) % 3)}
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
          <button className="text-zinc-400 hover:text-white transition-colors">
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
  );
}
