import { Play } from "lucide-react";

export default function Queue() {
  const tracks = ["Track One", "Track Two", "Track Three", "Track Four"];

  return (
    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3 text-white/80">Queue</h2>
      <div className="space-y-2">
        {tracks.map((track, i) => (
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
        ))}
      </div>
    </div>
  );
}
