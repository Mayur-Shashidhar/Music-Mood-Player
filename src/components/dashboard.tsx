// components/Dashboard.tsx
import { Search, Plus } from "lucide-react";

export default function Dashboard() {
  return (
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
  );
}
