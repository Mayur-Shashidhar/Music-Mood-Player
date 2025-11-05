"use client";
import { useState } from "react";

import MoodSelect from "@/components/moodSelector";
import Dashboard from "@/components/dashboard";
import Player from "@/components/player";
import Queue from "@/components/Queue";
import { Track, allTracks } from "@/data/tracks";

const moods = [
  { 
    name: "Happy", 
    gradient: "from-yellow-300 via-yellow-400 to-amber-500",
    bgColor: "#FFC107",
    description: "Uplifting and energetic vibes"
  },
  { 
    name: "Sad", 
    gradient: "from-blue-900 via-blue-700 to-blue-500",
    bgColor: "#1976D2",
    description: "Melancholic and reflective tunes"
  },
  { 
    name: "Chill", 
    gradient: "from-teal-600 via-green-600 to-emerald-700",
    bgColor: "#00897B",
    description: "Relaxed and laid-back sounds"
  },
  { 
    name: "Focused", 
    gradient: "from-purple-600 via-purple-500 to-pink-500",
    bgColor: "#7E57C2",
    description: "Deep concentration music"
  },
];

export default function HomePage() {
  const [mood, setMood] = useState("Chill");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const currentMood = moods.find((m) => m.name === mood) || moods[2];

  const handleNextTrack = () => {
    if (!currentTrack) {
      setCurrentTrack(allTracks[0]);
      return;
    }
    const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % allTracks.length;
    setCurrentTrack(allTracks[nextIndex]);
  };

  const handlePreviousTrack = () => {
    if (!currentTrack) {
      setCurrentTrack(allTracks[0]);
      return;
    }
    const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? allTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(allTracks[previousIndex]);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Dashboard */}
        <Dashboard mood={currentMood} onTrackSelect={setCurrentTrack} />

        {/* Right: Mood Select + Queue */}
        <div className="flex flex-col w-80 bg-zinc-900 border-l border-zinc-800">
          <MoodSelect mood={mood} setMood={setMood} moods={moods} />
          <Queue currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
        </div>
      </div>

      {/* Bottom Player - Always Visible */}
      <div className="flex-shrink-0">
        <Player 
          currentTrack={currentTrack} 
          mood={currentMood}
          onNextTrack={handleNextTrack}
          onPreviousTrack={handlePreviousTrack}
        />
      </div>
    </div>
  );
}
