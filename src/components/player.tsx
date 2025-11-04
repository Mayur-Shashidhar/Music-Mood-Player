import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
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
  );
}
