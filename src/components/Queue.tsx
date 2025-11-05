"use client";
import { Play, Music2, MoreVertical } from "lucide-react";
import { Track, allTracks } from "@/data/tracks";

interface QueueProps {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
}

export default function Queue({ currentTrack, setCurrentTrack }: QueueProps) {
  const tracks: Track[] = allTracks;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Queue</h2>
        <button className="text-sm text-zinc-400 hover:text-white">Clear</button>
      </div>
      <div className="space-y-1">
        {tracks.map((track, i) => (
          <div
            key={track.id}
            onClick={() => setCurrentTrack(track)}
            className={`group flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 cursor-pointer transition-colors ${
              currentTrack?.id === track.id ? "bg-zinc-800" : ""
            }`}
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
            <div className="w-10 h-10 bg-zinc-700 rounded flex-shrink-0 flex items-center justify-center">
              <Music2 size={20} className="text-zinc-500" />
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
    </div>
  );
}
