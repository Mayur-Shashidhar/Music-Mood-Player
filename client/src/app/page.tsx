"use client";
import { useState, useEffect } from "react";

import MoodSelect from "@/components/moodSelector";
import Dashboard from "@/components/dashboard";
import Player from "@/components/player";
import Queue from "@/components/Queue";
import AuthModal from "@/components/AuthModal";
import { Track } from "@/data/tracks";
import { fetchTracksByMood } from "@/services/musicService";
import { 
  getCurrentUser, 
  logout as apiLogout,
  getUserPlaylists,
  getLikedSongs,
  createPlaylist as apiCreatePlaylist,
  deletePlaylist as apiDeletePlaylist,
  addTrackToPlaylist as apiAddTrackToPlaylist,
  removeTrackFromPlaylist as apiRemoveTrackFromPlaylist,
  likeSong as apiLikeSong,
  unlikeSong as apiUnlikeSong,
} from "@/services/authService";

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
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: repeat all, 2: repeat one
  const [originalTracksOrder, setOriginalTracksOrder] = useState<Track[]>([]);
  const [playbackQueue, setPlaybackQueue] = useState<Track[]>([]);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [likedSongsTracks, setLikedSongsTracks] = useState<Track[]>([]); // Actual track objects
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  const currentMood = moods.find((m) => m.name === mood) || moods[2];

  // Handle track selection with autoplay
  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setShouldAutoPlay(true);
  };

  // Handle playing a playlist (replaces queue)
  const handlePlayPlaylist = (tracks: Track[]) => {
    if (tracks.length > 0) {
      setAllTracks(tracks);
      setOriginalTracksOrder(tracks);
      setPlaybackQueue(tracks);
      setCurrentTrack(tracks[0]);
      setShouldAutoPlay(true);
      setIsShuffled(false); // Reset shuffle when playing a new playlist
    }
  };

  // Handle authentication success
  const handleAuthSuccess = async (token: string, userData: any) => {
    setUser(userData);
    // Load user's playlists and liked songs
    try {
      const likedTracks = await getLikedSongs();
      const likedIds = new Set<string>(likedTracks.map((track: Track) => track.id));
      setLikedSongs(likedIds);
      setLikedSongsTracks(likedTracks);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    apiLogout();
    setUser(null);
    setLikedSongs(new Set());
    setLikedSongsTracks([]);
  };

  // Auto-login on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { user: userData } = await getCurrentUser();
          setUser(userData);
          
          // Load user's liked songs
          const likedTracks = userData.likedSongs || [];
          const likedIds = new Set<string>(likedTracks.map((track: Track) => track.id));
          setLikedSongs(likedIds);
          setLikedSongsTracks(likedTracks);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  // Toggle like for a track (with API integration)
  const toggleLike = async (trackId: string) => {
    if (!user) {
      // If not logged in, show auth modal
      setShowAuthModal(true);
      return;
    }

    const track = allTracks.find(t => t.id === trackId) || 
                  playbackQueue.find(t => t.id === trackId) ||
                  likedSongsTracks.find(t => t.id === trackId) ||
                  currentTrack;
    
    if (!track) return;

    const isLiked = likedSongs.has(trackId);

    // Optimistic update
    setLikedSongs(prev => {
      const newLiked = new Set(prev);
      if (isLiked) {
        newLiked.delete(trackId);
      } else {
        newLiked.add(trackId);
      }
      return newLiked;
    });

    // Update liked songs tracks array
    if (isLiked) {
      setLikedSongsTracks(prev => prev.filter(t => t.id !== trackId));
    } else {
      setLikedSongsTracks(prev => [...prev, track]);
    }

    try {
      if (isLiked) {
        await apiUnlikeSong(trackId);
      } else {
        await apiLikeSong(track);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikedSongs(prev => {
        const newLiked = new Set(prev);
        if (isLiked) {
          newLiked.add(trackId);
        } else {
          newLiked.delete(trackId);
        }
        return newLiked;
      });
      // Revert tracks array
      if (isLiked) {
        setLikedSongsTracks(prev => [...prev, track]);
      } else {
        setLikedSongsTracks(prev => prev.filter(t => t.id !== trackId));
      }
    }
  };

  // Fetch tracks when mood changes
  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      const tracks = await fetchTracksByMood(mood, 30);
      console.log('Loaded tracks for mood:', mood, tracks.slice(0, 3).map(t => ({ title: t.title, image: t.image })));
      setAllTracks(tracks);
      setOriginalTracksOrder(tracks);
      setPlaybackQueue(tracks);
      setIsLoading(false);
    };
    loadTracks();
  }, [mood]);

  // Shuffle function
  const shuffleArray = (array: Track[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleShuffle = (shouldShuffle: boolean) => {
    setIsShuffled(shouldShuffle);
    if (shouldShuffle) {
      // Keep current track at the front, shuffle the rest
      if (currentTrack) {
        const otherTracks = allTracks.filter(t => t.id !== currentTrack.id);
        const shuffled = shuffleArray(otherTracks);
        const newQueue = [currentTrack, ...shuffled];
        setPlaybackQueue(newQueue);
      } else {
        const shuffled = shuffleArray(allTracks);
        setPlaybackQueue(shuffled);
      }
    } else {
      // Restore original order
      setPlaybackQueue(originalTracksOrder);
    }
  };

  const handleRepeatMode = (mode: number) => {
    setRepeatMode(mode);
  };

  const handleNextTrack = () => {
    if (playbackQueue.length === 0) return;
    
    if (!currentTrack) {
      setCurrentTrack(playbackQueue[0]);
      return;
    }

    // Repeat one mode - replay the same track
    if (repeatMode === 2) {
      // Just restart the same track (player will handle this)
      return;
    }

    const currentIndex = playbackQueue.findIndex((track: Track) => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playbackQueue.length;
    
    // If repeat all is off and we're at the end, stop
    if (repeatMode === 0 && currentIndex === playbackQueue.length - 1) {
      return;
    }

    setCurrentTrack(playbackQueue[nextIndex]);
  };

  const handlePreviousTrack = () => {
    if (playbackQueue.length === 0) return;
    
    if (!currentTrack) {
      setCurrentTrack(playbackQueue[0]);
      return;
    }
    const currentIndex = playbackQueue.findIndex((track: Track) => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? playbackQueue.length - 1 : currentIndex - 1;
    setCurrentTrack(playbackQueue[previousIndex]);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Dashboard */}
        <Dashboard 
          mood={currentMood} 
          onTrackSelect={handleTrackSelect} 
          onPlayPlaylist={handlePlayPlaylist}
          allTracks={allTracks}
          likedSongs={likedSongs}
          likedSongsTracks={likedSongsTracks}
          onToggleLike={toggleLike}
          user={user}
          onShowAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />

        {/* Right: Mood Select + Queue */}
        <div className="flex flex-col w-80 bg-zinc-900 border-l border-zinc-800">
          <MoodSelect mood={mood} setMood={setMood} moods={moods} />
          <Queue 
            currentTrack={currentTrack} 
            setCurrentTrack={handleTrackSelect}
            allTracks={playbackQueue}
            isLoading={isLoading}
            isShuffled={isShuffled}
          />
        </div>
      </div>

      {/* Bottom Player - Always Visible */}
      <div className="flex-shrink-0">
        <Player 
          currentTrack={currentTrack} 
          mood={currentMood}
          onNextTrack={handleNextTrack}
          onPreviousTrack={handlePreviousTrack}
          isShuffled={isShuffled}
          onShuffleToggle={handleShuffle}
          repeatMode={repeatMode}
          onRepeatModeChange={handleRepeatMode}
          shouldAutoPlay={shouldAutoPlay}
          onAutoPlayHandled={() => setShouldAutoPlay(false)}
          isLiked={currentTrack ? likedSongs.has(currentTrack.id) : false}
          onToggleLike={() => currentTrack && toggleLike(currentTrack.id)}
        />
      </div>
    </div>
  );
}
