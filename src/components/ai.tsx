"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Search, Plus } from "lucide-react";

const moods = [
  { name: "Happy", color: "#FFD54F" },
  { name: "Sad", color: "#64B5F6" },
  { name: "Chill", color: "#81C784" },
  { name: "Focused", color: "#BA68C8" },
];

export default function MoodMusicApp() {
  const [mood, setMood] = useState("Chill");
  const [isPlaying, setIsPlaying] = useState(false);

  const theme = moods.find((m) => m.name === mood)?.color || "#81C784";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme + "20" }}
    >
      {/* Main Layout */}
      <div className="flex flex-1 p-6 gap-6">
        {/* Dashboard on Left */}
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2">
            <Search className="text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search music, playlists, or artists..."
              className="bg-transparent flex-1 outline-none text-white placeholder-white/40"
            />
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {/* Playlists */}
            <div className="flex flex-col bg-white/5 rounded-xl p-4 text-white/70 h-36 gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Playlists</span>
                <Plus
                  className="text-white/70 hover:text-white cursor-pointer"
                  size={28}
                />
              </div>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 bg-white/10 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Explore with Genre/Tags */}
            <div className="flex flex-col bg-white/5 rounded-xl p-4 text-white/70 gap-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Explore</span>
                <div className="flex gap-2">
                  {["Pop", "Rock", "Jazz", "Lo-Fi"].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 text-xs bg-white/10 rounded-full hover:bg-white/20 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 mt-2">Explore playlists by genre</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Mood & Queue */}
        <div className="flex flex-col w-1/4 gap-4">
          {/* Mood Section (Half Height) */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg h-1/4">
            <h2 className="text-lg font-semibold mb-4 text-white/80">
              Select Mood
            </h2>
            <div className="grid grid-cols-2 gap-3 w-full">
              {moods.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setMood(m.name)}
                  className={`rounded-xl py-3 text-sm font-medium transition-all border border-white/20 ${
                    mood === m.name
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Section (Extended Height) */}
          <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-white/80">Queue</h2>
            <div className="space-y-2">
              {["Track One", "Track Two", "Track Three", "Track Four"].map(
                (track, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg text-white/70 hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg" />
                      <span>{track}</span>
                    </div>
                    <Play
                      className="text-white/70 hover:text-white cursor-pointer"
                      size={18}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Player Section (Full Width with Progress on Top and Controls Centered) */}
      <div className="w-full bg-white/10 backdrop-blur-md p-4 rounded-t-2xl flex flex-col gap-4 items-center">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full">
          <div className="h-1 bg-white/80 w-1/3 rounded-full" />
        </div>

        {/* Player Controls (Centered) */}
        <div className="flex items-center justify-center gap-6">
          <SkipBack className="text-white/80 cursor-pointer hover:text-white" />
          {isPlaying ? (
            <Pause
              className="text-white/80 cursor-pointer hover:text-white"
              onClick={() => setIsPlaying(false)}
            />
          ) : (
            <Play
              className="text-white/80 cursor-pointer hover:text-white"
              onClick={() => setIsPlaying(true)}
            />
          )}
          <SkipForward className="text-white/80 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
}
