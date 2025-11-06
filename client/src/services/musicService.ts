// API service to fetch music from backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://music-mood-player-1.onrender.com';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audio?: string;
  preview?: string;
  audioDownload?: string;
  image?: string;
  source?: string;
}

export const fetchTracksByMood = async (mood: string, limit: number = 20): Promise<Track[]> => {
  try {
    const response = await fetch(`${API_URL}/api/playlists/mood/${mood}?limit=${limit}`);
    const data = await response.json();
    
    if (data.success && data.playlist?.tracks) {
      return data.playlist.tracks.map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        audio: track.audio || track.preview,
        preview: track.preview,
        audioDownload: track.audioDownload,
        image: track.image,
        source: track.source
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching tracks by mood:', error);
    return [];
  }
};

export const searchTracks = async (query: string, limit: number = 20): Promise<Track[]> => {
  try {
    const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    const data = await response.json();
    
    if (data.success && data.results) {
      return data.results.map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        audio: track.audio || track.preview,
        preview: track.preview,
        audioDownload: track.audioDownload,
        image: track.image,
        source: track.source
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

export const fetchTrendingTracks = async (limit: number = 20): Promise<Track[]> => {
  try {
    const response = await fetch(`${API_URL}/api/tracks/trending?limit=${limit}`);
    const data = await response.json();
    
    if (data.success && data.tracks) {
      return data.tracks.map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        audio: track.audio || track.preview,
        preview: track.preview,
        audioDownload: track.audioDownload,
        image: track.image,
        source: track.source
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return [];
  }
};

// Default tracks as fallback
export const allTracks: Track[] = [
  { id: "1", title: "Loading...", artist: "Please wait", album: "Fetching music", duration: "0:00" },
];
