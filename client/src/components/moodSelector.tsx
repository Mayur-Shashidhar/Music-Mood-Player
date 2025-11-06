interface Mood {
  name: string;
  gradient: string;
  bgColor: string;
  description: string;
}

export default function MoodSelect({
  mood,
  setMood,
  moods,
}: {
  mood: string;
  setMood: (val: string) => void;
  moods: Mood[];
}) {
  return (
    <div className="p-6 border-b border-zinc-800/50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
          Select Your Mood
        </h2>
        <p className="text-sm text-zinc-400">Choose the vibe that matches your current feeling</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {moods.map((m, index) => (
          <button
            key={m.name}
            onClick={() => setMood(m.name)}
            className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 ease-out transform ${
              mood === m.name
                ? "ring-2 ring-white/80 scale-105 shadow-2xl shadow-black/40"
                : "hover:scale-105 hover:shadow-xl hover:shadow-black/20"
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Background gradient with enhanced effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} transition-all duration-300 ${
              mood === m.name ? 'opacity-100' : 'opacity-75 group-hover:opacity-90'
            }`}></div>
            
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[length:20px_20px]"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className={`text-base font-bold mb-2 transition-all duration-200 ${
                mood === m.name ? 'text-white drop-shadow-lg' : 'text-white/95 group-hover:text-white'
              }`}>
                {m.name}
              </div>
              <div className={`text-xs leading-relaxed transition-all duration-200 ${
                mood === m.name ? 'text-white/90 drop-shadow-md' : 'text-white/80 group-hover:text-white/90'
              } line-clamp-2`}>
                {m.description}
              </div>
            </div>
            
            {/* Active indicator */}
            {mood === m.name && (
              <div className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
            )}
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              mood === m.name ? 'bg-white/5' : 'bg-transparent group-hover:bg-white/5'
            }`}></div>
          </button>
        ))}
      </div>
    </div>
  );
}
