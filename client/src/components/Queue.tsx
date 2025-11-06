"use client";
import { Play, Music2, MoreVertical, Loader2, Shuffle } from "lucide-react";
import { Track } from "@/data/tracks";

interface QueueProps {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
  allTracks: Track[];
  isLoading?: boolean;
  isShuffled?: boolean;
}

export default function Queue({ currentTrack, setCurrentTrack, allTracks, isLoading, isShuffled }: QueueProps) {
  const tracks: Track[] = allTracks;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold">Queue</h2>
        {isShuffled && (
          <div className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full animate-pulse">
            <Shuffle size={12} />
            <span>Shuffled</span>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          <Music2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>No tracks available</p>
          <p className="text-sm mt-2">Try selecting a different mood</p>
        </div>
      ) : (
        <div className="space-y-1">
        {tracks.map((track, i) => (
          <div
            key={`${track.id}-${i}`}
            onClick={() => setCurrentTrack(track)}
            className={`group flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 cursor-pointer transition-all duration-300 ${
              currentTrack?.id === track.id ? "bg-zinc-800" : ""
            } ${isShuffled ? 'animate-slideIn' : ''}`}
            style={{
              animationDelay: isShuffled ? `${i * 30}ms` : '0ms'
            }}
          >
            <div className="w-8 text-center text-zinc-400 text-sm">
              {currentTrack?.id === track.id ? (
                <Music2 size={16} className="inline text-green-500" />
              ) : (
                <span className="group-hover:hidden">{i + 1}</span>
              )}
              <Play
                size={16}
                className="hidden group-hover:inline text-white"
              />
            </div>
            <div className="w-10 h-10 bg-zinc-700 rounded flex-shrink-0 overflow-hidden">
              {track.image ? (
                <img 
                  src={track.image} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-500"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music2 size={20} className="text-zinc-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${
                currentTrack?.id === track.id ? "text-green-500" : "text-white"
              }`}>
                {track.title}
              </div>
              <div className="text-xs text-zinc-400 truncate">{track.artist}</div>
            </div>
            <div className="text-xs text-zinc-400">{track.duration}</div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={18} className="text-zinc-400 hover:text-white" />
            </button>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
