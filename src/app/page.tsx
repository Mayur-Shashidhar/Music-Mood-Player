"use client";
import { useState } from "react";

import MoodSelect from "@/components/moodSelector";
import Dashboard from "@/components/dashboard";
import Player from "@/components/player";
import Queue from "@/components/Queue";

const moods = [
  { name: "Happy", color: "#FFD54F" },
  { name: "Sad", color: "#64B5F6" },
  { name: "Chill", color: "#81C784" },
  { name: "Focused", color: "#BA68C8" },
];

export default function HomePage() {
  const [mood, setMood] = useState("Chill");
  const theme = moods.find((m) => m.name === mood)?.color || "#81C784";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme + "20" }}
    >
      <div className="flex flex-1 p-6 gap-6">
        {/* Left: Dashboard */}
        <Dashboard />

        {/* Right: Mood Select + Queue */}
        <div className="flex flex-col w-1/4 gap-4">
          <MoodSelect mood={mood} setMood={setMood} />
          <Queue />
        </div>
      </div>

      {/* Bottom Player */}
      <Player />
    </div>
  );
}
