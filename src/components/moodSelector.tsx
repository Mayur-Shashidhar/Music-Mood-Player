const moods = [
  { name: "Happy", color: "#FFD54F" },
  { name: "Sad", color: "#64B5F6" },
  { name: "Chill", color: "#81C784" },
  { name: "Focused", color: "#BA68C8" },
];

export default function MoodSelect({
  mood,
  setMood,
}: {
  mood: string;
  setMood: (val: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg h-1/4">
      <h2 className="text-lg font-semibold mb-4 text-white/80">Select Mood</h2>
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
  );
}
