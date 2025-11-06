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
    <div className="p-6 border-b border-zinc-800">
      <h2 className="text-xl font-bold mb-4">Select Your Mood</h2>
      <div className="grid grid-cols-2 gap-3">
        {moods.map((m) => (
          <button
            key={m.name}
            onClick={() => setMood(m.name)}
            className={`relative overflow-hidden rounded-lg p-4 transition-all ${
              mood === m.name
                ? "ring-2 ring-white scale-105"
                : "hover:scale-105"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} ${mood === m.name ? 'opacity-100' : 'opacity-60'}`}></div>
            <div className="relative z-10">
              <div className="text-sm font-bold mb-1">{m.name}</div>
              <div className="text-xs opacity-90 line-clamp-2">{m.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
