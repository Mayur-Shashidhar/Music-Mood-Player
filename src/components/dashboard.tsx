// components/Dashboard.tsx
"use client";
import { Search, Home, Library, Clock, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { Track, allTracks } from "@/data/tracks";

interface Mood {
  name: string;
  gradient: string;
  bgColor: string;
  description: string;
}

export default function Dashboard({ mood, onTrackSelect }: { mood: Mood; onTrackSelect: (track: Track) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const playlists = [
    { id: 1, name: "Daily Mix 1", tracks: 50, image: mood.gradient },
    { id: 2, name: "Discover Weekly", tracks: 30, image: mood.gradient },
    { id: 3, name: "Release Radar", tracks: 40, image: mood.gradient },
    { id: 4, name: "Liked Songs", tracks: 128, image: mood.gradient },
    { id: 5, name: "Chill Vibes", tracks: 67, image: mood.gradient },
    { id: 6, name: "Workout Mix", tracks: 45, image: mood.gradient },
  ];

  const recentlyPlayed: Track[] = allTracks.slice(0, 4);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-black p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-4 text-white hover:text-white transition-colors">
            <Home size={24} />
            <span className="font-semibold">Home</span>
          </button>
          <button className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors">
            <Search size={24} />
            <span className="font-semibold">Search</span>
          </button>
          <button className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors">
            <Library size={24} />
            <span className="font-semibold">Your Library</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <button className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors">
            <Plus size={24} />
            <span className="font-semibold">Create Playlist</span>
          </button>
          <button className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors">
            <Heart size={24} />
            <span className="font-semibold">Liked Songs</span>
          </button>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {["My Playlist #1", "Road Trip Mix", "Study Beats", "Party Hits", "Workout Power"].map((playlist, i) => (
              <button key={i} className="text-zinc-400 hover:text-white text-left text-sm transition-colors">
                {playlist}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black overflow-y-auto">
        {/* Header with Gradient */}
        <div className={`bg-gradient-to-b ${mood.gradient} p-8 pb-6`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96 bg-white rounded-full px-12 py-3 text-black placeholder-zinc-600 outline-none focus:ring-2 focus:ring-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Good evening</h1>
          <p className="text-white/80">{mood.description}</p>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-8">
          {/* Your Top Mixes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your top mixes</h2>
              <button className="text-sm font-semibold text-zinc-400 hover:text-white">Show all</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {playlists.slice(0, 6).map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-zinc-800/40 hover:bg-zinc-800 p-4 rounded-lg transition-all cursor-pointer group"
                >
                  <div className={`w-full aspect-square bg-gradient-to-br ${playlist.image} rounded-lg mb-4 shadow-lg`}></div>
                  <h3 className="font-semibold mb-1 truncate">{playlist.name}</h3>
                  <p className="text-sm text-zinc-400">{playlist.tracks} tracks</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recently Played */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recently played</h2>
              <button className="text-sm font-semibold text-zinc-400 hover:text-white">Show all</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {recentlyPlayed.map((track) => (
                <div
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className="flex items-center gap-4 bg-zinc-800/40 hover:bg-zinc-800 p-3 rounded-lg transition-all cursor-pointer group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${mood.gradient} rounded flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{track.title}</h4>
                    <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                  </div>
                  <Clock className="text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                </div>
              ))}
            </div>
          </section>

          {/* Browse by Genre */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Browse by genre</h2>
            <div className="grid grid-cols-4 gap-4">
              {["Pop", "Rock", "Jazz", "Electronic", "Hip-Hop", "Classical", "R&B", "Country"].map((genre, i) => (
                <div
                  key={i}
                  className={`h-32 bg-gradient-to-br ${mood.gradient} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform flex items-end relative overflow-hidden`}
                  style={{ opacity: 0.9 - i * 0.05 }}
                >
                  <span className="font-bold text-2xl relative z-10">{genre}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
