export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

export const allTracks: Track[] = [
  { id: "1", title: "Midnight Dreams", artist: "Luna Wave", album: "Echoes", duration: "3:45" },
  { id: "2", title: "Sunrise Boulevard", artist: "The Rhythm Makers", album: "Morning Glory", duration: "4:12" },
  { id: "3", title: "Electric Hearts", artist: "Neon Pulse", album: "Frequency", duration: "3:28" },
  { id: "4", title: "Ocean Breeze", artist: "Coastal Sounds", album: "Tides", duration: "5:03" },
  { id: "5", title: "City Lights", artist: "Urban Echo", album: "Urban Stories", duration: "3:56" },
  { id: "6", title: "Starlight Symphony", artist: "Celestial Band", album: "Cosmos", duration: "4:31" },
  { id: "7", title: "Desert Winds", artist: "Nomad Soul", album: "Wanderer", duration: "3:19" },
  { id: "8", title: "Rainy Day Blues", artist: "Cloud Nine", album: "Weather", duration: "4:45" },
];
