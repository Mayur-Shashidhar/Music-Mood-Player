// components/Dashboard.tsx
"use client";
import { Search, Home, Play, Plus, X, Check, Heart, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Track } from "@/data/tracks";
import { searchTracks } from "@/services/musicService";
import { 
  getUserPlaylists,
  createPlaylist as apiCreatePlaylist,
  deletePlaylist as apiDeletePlaylist,
  addTrackToPlaylist as apiAddTrackToPlaylist,
  removeTrackFromPlaylist as apiRemoveTrackFromPlaylist,
  changePassword as apiChangePassword,
  deleteAccount as apiDeleteAccount,
} from "@/services/authService";

interface Mood {
  name: string;
  gradient: string;
  bgColor: string;
  description: string;
}

interface UserPlaylist {
  id: number;
  name: string;
  tracks: Track[];
  createdAt: Date;
}

interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  likedSongs?: Track[];
}

export default function Dashboard({ 
  mood, 
  onTrackSelect, 
  onPlayPlaylist, 
  allTracks, 
  likedSongs,
  likedSongsTracks,
  onToggleLike,
  user,
  onShowAuth,
  onLogout,
}: { 
  mood: Mood; 
  onTrackSelect: (track: Track) => void;
  onPlayPlaylist: (tracks: Track[]) => void;
  allTracks: Track[];
  likedSongs: Set<string>;
  likedSongsTracks: Track[];
  onToggleLike: (trackId: string) => void;
  user: User | null;
  onShowAuth: () => void;
  onLogout: () => void;
}) {
  const [activeView, setActiveView] = useState<"home" | "search" | "playlist" | "user-playlist" | "liked">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState<number | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    name: string;
    description: string;
    gradient: string;
    tracks: Track[];
  } | null>(null);
  
  // User playlist states
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedUserPlaylist, setSelectedUserPlaylist] = useState<UserPlaylist | null>(null);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState<Track | null>(null);
  const [welcomeAnimationKey, setWelcomeAnimationKey] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Show notification function
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); // Auto-hide after 4 seconds
  };

  // Get custom welcome message based on mood
  const getWelcomeMessage = (moodName: string) => {
    const messages: { [key: string]: string } = {
      "Happy": "Vibes high, smiles brighter",
      "Sad": "Rain before the bloom", 
      "Chill": "Waves calm, mind clear",
      "Focused": "Clarity meets ambition"
    };
    return messages[moodName] || "Welcome to your mood";
  };

  // Trigger welcome animation on mood change
  useEffect(() => {
    setWelcomeAnimationKey(prev => prev + 1);
  }, [mood.name]);

  // Load user playlists when user logs in
  useEffect(() => {
    const loadUserPlaylists = async () => {
      if (user) {
        try {
          const playlists = await getUserPlaylists();
          setUserPlaylists(playlists.map((p: any) => ({
            ...p,
            id: Number(p.id),
            createdAt: new Date(p.createdAt),
          })));
        } catch (error) {
          console.error('Error loading playlists:', error);
        }
      } else {
        setUserPlaylists([]);
      }
    };
    loadUserPlaylists();
  }, [user]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchTracks(searchQuery, 20);
      setSearchResults(results);
      setIsSearching(false);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Switch to search view when user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setActiveView("search");
    }
  }, [searchQuery]);

  // Curated playlists based on mood
  const getCuratedPlaylists = (currentMood: string) => {
    const playlistsByMood: { [key: string]: any[] } = {
      'Happy': [
        { id: 1, name: "Happy Vibes Mix", description: "Upbeat tracks to brighten your day", gradient: "from-yellow-300 via-yellow-400 to-amber-500" },
        { id: 2, name: "Energy Boost", description: "High energy music for motivation", gradient: "from-orange-400 via-yellow-400 to-amber-400" },
        { id: 3, name: "Feel Good Playlist", description: "Songs that make you smile", gradient: "from-amber-400 via-yellow-300 to-yellow-500" },
        { id: 4, name: "Sunshine Mix", description: "Bright and cheerful tunes", gradient: "from-yellow-400 via-amber-300 to-orange-400" },
        { id: 5, name: "Dance Party", description: "Get moving with these beats", gradient: "from-yellow-500 via-orange-400 to-red-400" },
        { id: 6, name: "Good Morning", description: "Start your day right", gradient: "from-amber-300 via-yellow-400 to-yellow-500" },
      ],
      'Sad': [
        { id: 1, name: "Melancholic Moments", description: "Embrace your feelings", gradient: "from-blue-900 via-blue-700 to-blue-500" },
        { id: 2, name: "Rainy Day Blues", description: "Perfect for introspective moods", gradient: "from-indigo-900 via-blue-800 to-blue-600" },
        { id: 3, name: "Emotional Journey", description: "Deep and meaningful tracks", gradient: "from-blue-800 via-blue-600 to-indigo-500" },
        { id: 4, name: "Quiet Reflection", description: "Time for contemplation", gradient: "from-blue-700 via-indigo-600 to-purple-500" },
        { id: 5, name: "Heartfelt Ballads", description: "Songs that touch the soul", gradient: "from-blue-900 via-purple-800 to-indigo-700" },
        { id: 6, name: "Midnight Thoughts", description: "Late night listening", gradient: "from-indigo-900 via-blue-900 to-slate-800" },
      ],
      'Chill': [
        { id: 1, name: "Chill Lounge", description: "Relaxed vibes for unwinding", gradient: "from-teal-600 via-green-600 to-emerald-700" },
        { id: 2, name: "Ambient Dreams", description: "Atmospheric soundscapes", gradient: "from-emerald-700 via-teal-600 to-cyan-600" },
        { id: 3, name: "Lazy Sunday", description: "Take it easy", gradient: "from-green-600 via-emerald-600 to-teal-600" },
        { id: 4, name: "Coffee Shop Beats", description: "Background music for relaxation", gradient: "from-teal-700 via-green-700 to-emerald-800" },
        { id: 5, name: "Nature Sounds", description: "Peaceful and calming", gradient: "from-emerald-600 via-green-500 to-teal-500" },
        { id: 6, name: "Evening Wind Down", description: "End your day peacefully", gradient: "from-teal-800 via-emerald-700 to-green-700" },
      ],
      'Focused': [
        { id: 1, name: "Deep Focus", description: "Concentration music", gradient: "from-purple-600 via-purple-500 to-pink-500" },
        { id: 2, name: "Study Session", description: "Perfect for productivity", gradient: "from-indigo-600 via-purple-600 to-purple-500" },
        { id: 3, name: "Work Mode", description: "Get things done", gradient: "from-purple-700 via-indigo-600 to-blue-600" },
        { id: 4, name: "Classical Focus", description: "Timeless concentration aids", gradient: "from-purple-500 via-pink-500 to-rose-500" },
        { id: 5, name: "Coding Flow", description: "Developer's soundtrack", gradient: "from-indigo-700 via-purple-700 to-fuchsia-600" },
        { id: 6, name: "Meditation Mix", description: "Clear your mind", gradient: "from-purple-600 via-violet-600 to-purple-700" },
      ]
    };

    return playlistsByMood[currentMood] || playlistsByMood['Chill'];
  };

  const curatedPlaylists = getCuratedPlaylists(mood.name);
  const recentlyPlayed: Track[] = allTracks.slice(0, 4);

  // Map playlist names to search keywords for better results
  const getPlaylistKeyword = (playlistName: string): string => {
    const playlistKeywords: { [key: string]: string } = {
      // Happy
      'Happy Vibes Mix': 'happy upbeat',
      'Energy Boost': 'energetic powerful',
      'Feel Good Playlist': 'positive cheerful',
      'Sunshine Mix': 'bright sunny',
      'Dance Party': 'dance electronic',
      'Good Morning': 'morning fresh',
      
      // Sad
      'Melancholic Moments': 'melancholic emotional',
      'Rainy Day Blues': 'sad blues',
      'Emotional Journey': 'emotional ballad',
      'Quiet Reflection': 'quiet ambient',
      'Heartfelt Ballads': 'ballad heartfelt',
      'Midnight Thoughts': 'night ambient',
      
      // Chill
      'Chill Lounge': 'chill lounge',
      'Ambient Dreams': 'ambient dreamy',
      'Lazy Sunday': 'relaxing easy',
      'Coffee Shop Beats': 'lofi chill',
      'Nature Sounds': 'nature peaceful',
      'Evening Wind Down': 'calm evening',
      
      // Focused
      'Deep Focus': 'focus instrumental',
      'Study Session': 'study concentration',
      'Work Mode': 'productive work',
      'Classical Focus': 'classical piano',
      'Coding Flow': 'electronic ambient',
      'Meditation Mix': 'meditation calm',
    };
    
    return playlistKeywords[playlistName] || mood.name.toLowerCase();
  };

  // Handle playlist click - show playlist detail view
  const handlePlaylistClick = async (playlist: any) => {
    setLoadingPlaylist(playlist.id);
    setActiveView("playlist");
    
    const searchKeyword = getPlaylistKeyword(playlist.name);
    
    try {
      const tracks = await searchTracks(searchKeyword, 30);
      
      if (tracks.length > 0) {
        setSelectedPlaylist({
          name: playlist.name,
          description: playlist.description,
          gradient: playlist.gradient,
          tracks: tracks,
        });
        console.log(`✅ Loaded ${tracks.length} tracks for "${playlist.name}"`);
      } else {
        console.log(`⚠️ No tracks found for "${playlist.name}", trying mood...`);
        // Fallback to mood-based tracks
        const moodTracks = await searchTracks(mood.name.toLowerCase(), 20);
        if (moodTracks.length > 0) {
          setSelectedPlaylist({
            name: playlist.name,
            description: playlist.description,
            gradient: playlist.gradient,
            tracks: moodTracks,
          });
        }
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
    } finally {
      setLoadingPlaylist(null);
    }
  };

  // Create new playlist
  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim() === "") return;
    if (!user) {
      onShowAuth();
      return;
    }
    
    try {
      const result = await apiCreatePlaylist(newPlaylistName.trim());
      const newPlaylist: UserPlaylist = {
        id: Number(result.playlist.id),
        name: result.playlist.name,
        tracks: [],
        createdAt: new Date(result.playlist.createdAt),
      };
      
      setUserPlaylists([...userPlaylists, newPlaylist]);
      setNewPlaylistName("");
      setShowCreatePlaylist(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
      showNotification('Failed to create playlist. Please try again.', 'error');
    }
  };

  // Add track to playlist
  const handleAddToPlaylist = async (playlistId: number, track: Track) => {
    if (!user) {
      onShowAuth();
      return;
    }

    try {
      await apiAddTrackToPlaylist(playlistId.toString(), track);
      
      // Update local state
      setUserPlaylists(userPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          // Check if track already exists
          if (!playlist.tracks.find(t => t.id === track.id)) {
            return { ...playlist, tracks: [...playlist.tracks, track] };
          }
        }
        return playlist;
      }));
      setShowAddToPlaylist(null);
    } catch (error) {
      console.error('Error adding track:', error);
      showNotification('Failed to add track. It may already be in the playlist.', 'error');
    }
  };

  // Remove track from playlist
  const handleRemoveFromPlaylist = async (playlistId: number, trackId: string) => {
    if (!user) return;

    try {
      await apiRemoveTrackFromPlaylist(playlistId.toString(), trackId);
      
      const updatedPlaylists = userPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          return { ...playlist, tracks: playlist.tracks.filter(t => t.id !== trackId) };
        }
        return playlist;
      });
      setUserPlaylists(updatedPlaylists);
      
      // Update selected playlist if it's currently being viewed
      if (selectedUserPlaylist?.id === playlistId) {
        const updatedPlaylist = updatedPlaylists.find(p => p.id === playlistId);
        if (updatedPlaylist) {
          setSelectedUserPlaylist(updatedPlaylist);
        }
      }
    } catch (error) {
      console.error('Error removing track:', error);
    }
  };

  // Delete playlist
  const handleDeletePlaylist = async (playlistId: number) => {
    if (!user) return;

    try {
      await apiDeletePlaylist(playlistId.toString());
      
      setUserPlaylists(userPlaylists.filter(p => p.id !== playlistId));
      if (selectedUserPlaylist?.id === playlistId) {
        setSelectedUserPlaylist(null);
        setActiveView("home");
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      showNotification('Failed to delete playlist. Please try again.', 'error');
    }
  };

  // Change password
  const handleChangePassword = () => {
    if (!user) return;
    setShowChangePassword(true);
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!user) return;
    setShowDeleteAccount(true);
  };

  const handleConfirmDeleteAccount = async (confirmationText: string) => {
    if (confirmationText !== 'DELETE') {
      return 'You must type "DELETE" exactly to confirm account deletion.';
    }

    try {
      await apiDeleteAccount();

      // Clear local storage and logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset all states
      setUserPlaylists([]);
      setSelectedUserPlaylist(null);
      setActiveView('home');
      setShowDeleteAccount(false);
      
      // Call logout to update parent component
      onLogout();
      
      return null; // Success
    } catch (error: any) {
      console.error('Error deleting account:', error);
      return `Failed to delete account: ${error.message}`;
    }
  };

  // Change Password Modal Component
  const ChangePasswordModal = ({ 
    onClose, 
    onSuccess, 
    onError 
  }: { 
    onClose: () => void; 
    onSuccess: () => void; 
    onError: (error: string) => void; 
  }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (newPassword.length < 6) {
        onError('New password must be at least 6 characters long.');
        return;
      }

      if (newPassword !== confirmPassword) {
        onError('New passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        await apiChangePassword(currentPassword, newPassword);
        onSuccess();
      } catch (error: any) {
        onError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-zinc-900 rounded-2xl p-8 w-96 max-w-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Change Password</h2>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-base font-medium mb-3">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-800 border-0 rounded-xl px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-base"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white focus:outline-none transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-base font-medium mb-3">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-zinc-800 border-0 rounded-xl px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-base"
                  placeholder="Enter new password (min 6 chars)"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white focus:outline-none transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white text-base font-medium mb-3">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-800 border-0 rounded-xl px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-base"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full py-4 px-6 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Delete Account Modal Component
  const DeleteAccountModal = ({ 
    onClose, 
    onConfirm 
  }: { 
    onClose: () => void; 
    onConfirm: (confirmationText: string) => Promise<string | null>; 
  }) => {
    const [confirmationText, setConfirmationText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      
      try {
        const result = await onConfirm(confirmationText);
        if (result) {
          setError(result);
        } else {
          onClose();
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-zinc-900 rounded-2xl p-8 w-96 max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Delete Account</h2>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-zinc-300 text-sm mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            
            <div className="text-zinc-400 text-sm space-y-1 mb-4">
              <p className="font-medium">This will permanently delete:</p>
              <p>- Your account data</p>
              <p>- All your playlists</p>
              <p>- All your liked songs</p>
            </div>

            <p className="text-zinc-300 text-sm font-medium">
              Type "DELETE" to confirm.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full bg-zinc-800 border-0 rounded-xl px-4 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-base"
                placeholder="Type DELETE to confirm"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || confirmationText !== 'DELETE'}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-400 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Notification Component
  const NotificationToast = () => {
    if (!notification) return null;

    return (
      <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right-full duration-300">
        <div className={`
          px-6 py-4 rounded-xl shadow-lg border backdrop-blur-sm max-w-sm
          ${notification.type === 'success' 
            ? 'bg-green-500/90 border-green-400 text-white' 
            : 'bg-red-500/90 border-red-400 text-white'
          }
        `}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <Check size={20} />
              ) : (
                <X size={20} />
              )}
            </div>
            <p className="font-medium text-sm">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Playlist</h2>
              <button 
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName("");
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              placeholder="My Playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreatePlaylist();
                if (e.key === 'Escape') {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName("");
                }
              }}
              autoFocus
              className="w-full bg-zinc-800 rounded px-4 py-3 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-white mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName("");
                }}
                className="flex-1 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-full font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={newPlaylistName.trim() === ""}
                className="flex-1 py-2 px-4 bg-white text-black hover:scale-105 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Playlist Modal */}
      {showAddToPlaylist && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-lg p-6 w-96 max-h-96 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add to Playlist</h2>
              <button 
                onClick={() => setShowAddToPlaylist(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            {userPlaylists.length === 0 ? (
              <div className="text-center text-zinc-400 py-8">
                <p className="mb-4">You don&apos;t have any playlists yet</p>
                <button
                  onClick={() => {
                    setShowAddToPlaylist(null);
                    setShowCreatePlaylist(true);
                  }}
                  className="py-2 px-6 bg-white text-black hover:scale-105 rounded-full font-semibold transition-all"
                >
                  Create Playlist
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                {userPlaylists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id, showAddToPlaylist)}
                    className="w-full text-left p-3 hover:bg-zinc-800 rounded transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">{playlist.name}</div>
                      <div className="text-sm text-zinc-400">{playlist.tracks.length} songs</div>
                    </div>
                    {playlist.tracks.find(t => t.id === showAddToPlaylist.id) && (
                      <Check size={20} className="text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal 
          onClose={() => setShowChangePassword(false)}
          onSuccess={() => {
            setShowChangePassword(false);
            showNotification('Password changed successfully!', 'success');
          }}
          onError={(error: string) => {
            showNotification(`Failed to change password: ${error}`, 'error');
          }}
        />
      )}

      {showDeleteAccount && (
        <DeleteAccountModal 
          onClose={() => setShowDeleteAccount(false)}
          onConfirm={handleConfirmDeleteAccount}
        />
      )}

      {/* Sidebar */}
      {/* Sidebar */}
      <div className="w-64 bg-black p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              setActiveView("home");
              setSearchQuery("");
              setSelectedPlaylist(null);
              setSelectedUserPlaylist(null);
            }}
            className={`flex items-center gap-4 transition-colors ${
              activeView === "home" ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Home size={24} />
            <span className="font-semibold">Home</span>
          </button>
          <button 
            onClick={() => {
              setActiveView("search");
              setSelectedPlaylist(null);
              setSelectedUserPlaylist(null);
            }}
            className={`flex items-center gap-4 transition-colors ${
              activeView === "search" ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Search size={24} />
            <span className="font-semibold">Search</span>
          </button>
          <button 
            onClick={() => {
              if (!user) {
                onShowAuth();
                return;
              }
              setActiveView("liked");
              setSelectedPlaylist(null);
              setSelectedUserPlaylist(null);
            }}
            className={`flex items-center gap-4 transition-colors ${
              activeView === "liked" ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Heart size={24} className={activeView === "liked" ? "fill-white" : ""} />
            <span className="font-semibold">Liked Songs</span>
          </button>
        </div>

        {/* Auth Section */}
        <div className="border-t border-zinc-800 pt-4">
          {user ? (
            <div className="space-y-3">
              <div className="px-2">
                <p className="text-sm text-zinc-400">Signed in as</p>
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
              <button 
                onClick={onLogout}
                className="w-full text-left px-2 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
              >
                Logout
              </button>
              <button 
                onClick={handleChangePassword}
                className="w-full text-left px-2 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
              >
                Change Password
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="w-full text-left px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <button 
              onClick={onShowAuth}
              className="w-full px-4 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <button 
            onClick={() => {
              if (!user) {
                onShowAuth();
                return;
              }
              setShowCreatePlaylist(true);
            }}
            className="flex items-center gap-4 text-zinc-400 hover:text-white transition-colors w-full"
          >
            <Plus size={24} />
            <span className="font-semibold">Create Playlist</span>
          </button>
        </div>

        {/* User Playlists */}
        {userPlaylists.length > 0 && (
          <div className="border-t border-zinc-800 pt-4 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Your Playlists</h3>
            <div className="flex flex-col gap-2">
              {userPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => {
                    setSelectedUserPlaylist(playlist);
                    setActiveView("user-playlist");
                    setSelectedPlaylist(null);
                  }}
                  className={`text-left text-sm transition-colors p-2 rounded ${
                    selectedUserPlaylist?.id === playlist.id 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold">{playlist.name}</div>
                  <div className="text-xs text-zinc-500">{playlist.tracks.length} songs</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-zinc-900 to-black overflow-y-auto">
        {/* Header with Gradient - Only for Home and Search */}
        {(activeView === "home" || activeView === "search") && (
          <div className={`bg-gradient-to-b ${mood.gradient} p-8 pb-6`}>
            {activeView === "home" ? (
              <>
                <h1 
                  key={`welcome-${welcomeAnimationKey}`}
                  className="text-6xl font-bold mb-2 animate-text-reveal"
                >
                  {getWelcomeMessage(mood.name)}
                </h1>
                <p 
                  key={`description-${welcomeAnimationKey}`}
                  className="text-white/80 text-lg animate-text-reveal-delayed"
                >
                  {mood.description}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1 max-w-3xl">
                    <input
                      type="text"
                      placeholder="What do you want to listen to?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-white rounded-full px-12 py-3 text-black placeholder-zinc-600 outline-none focus:ring-2 focus:ring-white"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <h1 className="text-4xl font-bold mb-2">Search</h1>
                <p className="text-white/80">Find your favorite songs, artists, and albums</p>
              </>
            )}
          </div>
        )}

        {/* Content Sections */}
        <div className="p-8 space-y-8">
          {/* Playlist Detail View */}
          {activeView === "playlist" && selectedPlaylist && (
            <>
              <section>
                <button
                  onClick={() => {
                    setActiveView("home");
                    setSelectedPlaylist(null);
                  }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                  <span className="text-2xl">←</span>
                  <span>Back to Home</span>
                </button>

                <div className="flex items-start gap-6 mb-8">
                  <div className={`w-48 h-48 bg-gradient-to-br ${selectedPlaylist.gradient} rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0`}>
                    <div className="text-8xl">🎵</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-2">PLAYLIST</p>
                    <h1 className="text-5xl font-bold mb-4">{selectedPlaylist.name}</h1>
                    <p className="text-zinc-400 mb-4">{selectedPlaylist.description}</p>
                    <p className="text-sm text-zinc-400">{selectedPlaylist.tracks.length} songs</p>
                    <button
                      onClick={() => {
                        onPlayPlaylist(selectedPlaylist.tracks);
                      }}
                      className="mt-6 bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-colors"
                    >
                      <Play size={24} className="fill-black" />
                      Play
                    </button>
                  </div>
                </div>

                {/* Track List */}
                <div className="space-y-1">
                  <div className="grid grid-cols-[50px_1fr_1fr_100px_50px_100px] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
                    <div>#</div>
                    <div>Title</div>
                    <div>Album</div>
                    <div>Duration</div>
                    <div></div>
                    <div></div>
                  </div>
                  {selectedPlaylist.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="grid grid-cols-[50px_1fr_1fr_100px_50px_100px] gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800/50 group items-center"
                    >
                      <div 
                        onClick={() => onTrackSelect(track)}
                        className="cursor-pointer"
                      >
                        <div className="text-zinc-400 group-hover:hidden">{index + 1}</div>
                        <Play size={16} className="hidden group-hover:block fill-white" />
                      </div>
                      <div 
                        onClick={() => onTrackSelect(track)}
                        className="flex flex-col min-w-0 cursor-pointer"
                      >
                        <span className="font-semibold truncate">{track.title}</span>
                        <span className="text-sm text-zinc-400 truncate">{track.artist}</span>
                      </div>
                      <div className="text-sm text-zinc-400 truncate">{track.album}</div>
                      <div className="text-sm text-zinc-400">{track.duration}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(track.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                      >
                        <Heart 
                          size={18} 
                          className={`transition-colors ${likedSongs.has(track.id) ? 'fill-green-500 text-green-500' : 'text-zinc-400 hover:text-white'}`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddToPlaylist(track);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-full text-sm font-semibold transition-all"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* User Playlist View */}
          {activeView === "user-playlist" && selectedUserPlaylist && (
            <>
              <section>
                <button
                  onClick={() => {
                    setActiveView("home");
                    setSelectedUserPlaylist(null);
                  }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                  <span className="text-2xl">←</span>
                  <span>Back to Home</span>
                </button>

                <div className="flex items-start gap-6 mb-8">
                  <div className={`w-48 h-48 bg-gradient-to-br ${mood.gradient} rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0`}>
                    <div className="text-8xl">📁</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-2">PLAYLIST</p>
                    <h1 className="text-5xl font-bold mb-4">{selectedUserPlaylist.name}</h1>
                    <p className="text-zinc-400 mb-4">Created by you</p>
                    <p className="text-sm text-zinc-400">{selectedUserPlaylist.tracks.length} songs</p>
                    <div className="flex gap-4 mt-6">
                      {selectedUserPlaylist.tracks.length > 0 && (
                        <button
                          onClick={() => {
                            onPlayPlaylist(selectedUserPlaylist.tracks);
                          }}
                          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-colors"
                        >
                          <Play size={24} className="fill-black" />
                          Play
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${selectedUserPlaylist.name}"?`)) {
                            handleDeletePlaylist(selectedUserPlaylist.id);
                          }
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                      >
                        Delete Playlist
                      </button>
                    </div>
                  </div>
                </div>

                {/* Track List */}
                {selectedUserPlaylist.tracks.length > 0 ? (
                  <div className="space-y-1">
                    <div className="grid grid-cols-[50px_1fr_1fr_100px_50px_100px] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
                      <div>#</div>
                      <div>Title</div>
                      <div>Album</div>
                      <div>Duration</div>
                      <div></div>
                      <div></div>
                    </div>
                    {selectedUserPlaylist.tracks.map((track, index) => (
                      <div
                        key={track.id}
                        className="grid grid-cols-[50px_1fr_1fr_100px_50px_100px] gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800/50 group items-center"
                      >
                        <div 
                          onClick={() => onTrackSelect(track)}
                          className="cursor-pointer"
                        >
                          <div className="text-zinc-400 group-hover:hidden">{index + 1}</div>
                          <Play size={16} className="hidden group-hover:block fill-white" />
                        </div>
                        <div 
                          onClick={() => onTrackSelect(track)}
                          className="flex flex-col min-w-0 cursor-pointer"
                        >
                          <span className="font-semibold truncate">{track.title}</span>
                          <span className="text-sm text-zinc-400 truncate">{track.artist}</span>
                        </div>
                        <div className="text-sm text-zinc-400 truncate">{track.album}</div>
                        <div className="text-sm text-zinc-400">{track.duration}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(track.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                        >
                          <Heart 
                            size={18} 
                            className={`transition-colors ${likedSongs.has(track.id) ? 'fill-green-500 text-green-500' : 'text-zinc-400 hover:text-white'}`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromPlaylist(selectedUserPlaylist.id, track.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-700 hover:bg-red-600 rounded-full text-sm font-semibold transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    <Plus size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">This playlist is empty</p>
                    <p className="text-sm">Search for songs and add them to this playlist</p>
                  </div>
                )}
              </section>
            </>
          )}

          {/* Search View */}
          {activeView === "search" && (
            <>
              {searchQuery.trim().length === 0 ? (
                /* Search Browse - Show when no query */
                <section>
                  <h2 className="text-2xl font-bold mb-6">Browse all</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { name: "Pop", gradient: "from-pink-500 to-purple-500" },
                      { name: "Rock", gradient: "from-red-500 to-orange-500" },
                      { name: "Hip-Hop", gradient: "from-yellow-500 to-orange-600" },
                      { name: "Jazz", gradient: "from-blue-500 to-indigo-500" },
                      { name: "Classical", gradient: "from-purple-500 to-pink-500" },
                      { name: "Electronic", gradient: "from-cyan-500 to-blue-500" },
                      { name: "Indie", gradient: "from-green-500 to-teal-500" },
                      { name: "R&B", gradient: "from-red-400 to-pink-500" },
                      { name: "Country", gradient: "from-amber-500 to-yellow-500" },
                      { name: "Latin", gradient: "from-orange-500 to-red-500" },
                      { name: "Metal", gradient: "from-gray-700 to-gray-900" },
                      { name: "Blues", gradient: "from-blue-600 to-blue-800" },
                    ].map((genre, i) => (
                      <div
                        key={i}
                        onClick={() => setSearchQuery(genre.name)}
                        className={`h-32 bg-gradient-to-br ${genre.gradient} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform flex items-end relative overflow-hidden`}
                      >
                        <span className="font-bold text-2xl relative z-10">{genre.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                /* Search Results */
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">
                      {isSearching ? "Searching..." : `Results for "${searchQuery}"`}
                    </h2>
                    {searchResults.length > 0 && (
                      <span className="text-sm text-zinc-400">{searchResults.length} tracks found</span>
                    )}
                  </div>
                  
                  {isSearching ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((track, index) => (
                        <div
                          key={track.id}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 group transition-all"
                        >
                          <div 
                            onClick={() => onTrackSelect(track)}
                            className="flex items-center justify-center w-10 h-10 bg-zinc-800 rounded group-hover:bg-green-500 transition-all cursor-pointer"
                          >
                            <Play size={20} className="fill-white" />
                          </div>
                          <div 
                            onClick={() => onTrackSelect(track)}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <h3 className="font-semibold truncate">{track.title}</h3>
                            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                          </div>
                          <div className="text-sm text-zinc-400 hidden md:block">{track.album}</div>
                          <div className="text-sm text-zinc-400">{track.duration}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLike(track.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Heart 
                              size={20} 
                              className={`transition-colors ${likedSongs.has(track.id) ? 'fill-green-500 text-green-500' : 'text-zinc-400 hover:text-white'}`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAddToPlaylist(track);
                            }}
                            className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-sm font-semibold transition-all"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-zinc-400">
                      <Search size={64} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg">No results found for &quot;{searchQuery}&quot;</p>
                      <p className="text-sm mt-2">Try different keywords or check your spelling</p>
                    </div>
                  )}
                </section>
              )}
            </>
          )}

          {/* Liked Songs View */}
          {activeView === "liked" && (
            <>
              <section>
                <button
                  onClick={() => setActiveView("home")}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
                >
                  <span className="text-2xl">←</span>
                  <span>Back to Home</span>
                </button>

                <div className="flex items-start gap-6 mb-8">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
                    <Heart size={80} className="text-white fill-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-2">PLAYLIST</p>
                    <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
                    <p className="text-zinc-400 mb-4">Your favorite tracks</p>
                    <p className="text-sm text-zinc-400">{likedSongsTracks.length} songs</p>
                    {likedSongsTracks.length > 0 && (
                      <button
                        onClick={() => {
                          if (likedSongsTracks.length > 0) {
                            onTrackSelect(likedSongsTracks[0]);
                          }
                        }}
                        className="mt-6 bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-full flex items-center gap-2 transition-colors"
                      >
                        <Play size={24} className="fill-black" />
                        Play
                      </button>
                    )}
                  </div>
                </div>

                {/* Track List */}
                {likedSongsTracks.length > 0 ? (
                  <div className="space-y-1">
                    <div className="grid grid-cols-[50px_1fr_1fr_100px_100px] gap-4 px-4 py-2 text-sm text-zinc-400 border-b border-zinc-800">
                      <div>#</div>
                      <div>Title</div>
                      <div>Album</div>
                      <div>Duration</div>
                      <div></div>
                    </div>
                    {likedSongsTracks
                      .map((track, index) => (
                        <div
                          key={track.id}
                          className="grid grid-cols-[50px_1fr_1fr_100px_100px] gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800/50 group items-center"
                        >
                          <div 
                            onClick={() => onTrackSelect(track)}
                            className="cursor-pointer"
                          >
                            <div className="text-zinc-400 group-hover:hidden">{index + 1}</div>
                            <Play size={16} className="hidden group-hover:block fill-white" />
                          </div>
                          <div 
                            onClick={() => onTrackSelect(track)}
                            className="flex flex-col min-w-0 cursor-pointer"
                          >
                            <span className="font-semibold truncate">{track.title}</span>
                            <span className="text-sm text-zinc-400 truncate">{track.artist}</span>
                          </div>
                          <div className="text-sm text-zinc-400 truncate">{track.album}</div>
                          <div className="text-sm text-zinc-400">{track.duration}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLike(track.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded-full text-sm font-semibold transition-all flex items-center gap-1"
                          >
                            <Heart size={16} className="fill-red-500 text-red-500" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    <Heart size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg mb-2">No liked songs yet</p>
                    <p className="text-sm">Songs you like will appear here</p>
                  </div>
                )}
              </section>
            </>
          )}

          {/* Home View */}
          {activeView === "home" && (
            <>
              {/* Curated Playlists for Current Mood */}
              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{mood.name} Playlists</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {curatedPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      onClick={() => handlePlaylistClick(playlist)}
                      className="hover:bg-white/5 p-4 rounded-lg transition-all duration-500 ease-out cursor-pointer group relative backdrop-blur-sm transform hover:scale-110 active:scale-95"
                    >
                      <div className={`w-full aspect-square bg-gradient-to-br ${playlist.gradient} rounded-lg mb-4 shadow-lg flex items-center justify-center relative overflow-hidden group-hover:shadow-xl group-hover:shadow-black/30 transition-all duration-500 ease-out`}>
                        {loadingPlaylist === playlist.id ? (
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <div className="text-6xl opacity-50 group-hover:opacity-30 transition-opacity duration-300">🎵</div>
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
                              <Play size={48} className="fill-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500 ease-out" />
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 truncate group-hover:text-white transition-colors duration-500 ease-out">{playlist.name}</h3>
                      <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors duration-500 ease-out">{playlist.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Current Mood Tracks */}
              <section>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">Your {mood.name} Mix</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {allTracks.slice(0, 6).map((track) => {
                    console.log('Your Mix track:', track.title, 'has image:', !!track.image, track.image?.substring(0, 50) + '...');
                    return (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-lg transition-all duration-500 ease-out group relative backdrop-blur-sm transform hover:scale-110 active:scale-95"
                    >
                      <div 
                        onClick={() => onTrackSelect(track)}
                        className={`w-16 h-16 bg-gradient-to-br ${mood.gradient} rounded flex-shrink-0 overflow-hidden relative cursor-pointer group-hover:shadow-lg transition-all duration-500 ease-out`}
                      >
                        {track.image ? (
                          <>
                            <img 
                              src={track.image} 
                              alt={track.title}
                              className="w-full h-full object-cover transition-transform duration-300"
                              onError={(e) => {
                                console.log('Image failed to load:', track.image);
                                // Try to show a fallback - hide the image and show the gradient background
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                // Show play button immediately since image failed
                                const playBtn = img.parentElement?.querySelector('.transition-opacity') as HTMLElement;
                                if (playBtn) playBtn.style.opacity = '0.6';
                              }}
                              onLoad={() => console.log('Image loaded successfully:', track.image)}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
                              <Play size={24} className="fill-white drop-shadow-lg" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play size={24} className="opacity-0 group-hover:opacity-100 transition-all duration-300 fill-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      <div 
                        onClick={() => onTrackSelect(track)}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h4 className="font-semibold truncate group-hover:text-white transition-colors duration-500 ease-out">{track.title}</h4>
                        <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors duration-500 ease-out">{track.artist}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(track.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center mr-2"
                      >
                        <Heart 
                          size={18} 
                          className={`transition-colors ${likedSongs.has(track.id) ? 'fill-green-500 text-green-500' : 'text-zinc-400 hover:text-white'}`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddToPlaylist(track);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-full text-xs font-semibold transition-all"
                      >
                        +
                      </button>
                    </div>
                    );
                  })}
                </div>
              </section>

              {/* Recommended for You */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Recommended for you</h2>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {allTracks.slice(6, 14).map((track, i) => {
                    console.log('Recommended track:', track.title, 'has image:', !!track.image, track.image?.substring(0, 50) + '...');
                    return (
                    <div
                      key={track.id}
                      className="hover:bg-white/5 p-4 rounded-lg transition-all duration-500 ease-out group relative backdrop-blur-sm transform hover:scale-110 active:scale-95"
                    >
                      <div 
                        onClick={() => onTrackSelect(track)}
                        className={`w-full aspect-square bg-gradient-to-br ${mood.gradient} rounded-lg mb-4 shadow-lg relative overflow-hidden group-hover:shadow-xl group-hover:shadow-black/30 transition-all duration-500 ease-out cursor-pointer`}
                      >
                        {track.image ? (
                          <>
                            <img 
                              src={track.image} 
                              alt={track.title}
                              className="w-full h-full object-cover transition-transform duration-300"
                              onError={(e) => {
                                console.log('Recommended image failed to load:', track.image);
                                // Hide the failed image and show the gradient background
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                // Show music note icon when image fails
                                const container = img.parentElement;
                                if (container) {
                                  const musicNote = document.createElement('div');
                                  musicNote.className = 'w-full h-full flex items-center justify-center';
                                  musicNote.innerHTML = '<span class="text-4xl opacity-30 group-hover:opacity-20 transition-opacity duration-300">🎵</span>';
                                  container.appendChild(musicNote);
                                }
                              }}
                              onLoad={() => console.log('Recommended image loaded successfully:', track.image)}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
                              <Play size={40} className="fill-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500 ease-out" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl opacity-30 group-hover:opacity-20 transition-opacity duration-300">🎵</span>
                            </div>
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center">
                              <Play size={40} className="fill-white drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500 ease-out" />
                            </div>
                          </>
                        )}
                      </div>
                      <div onClick={() => onTrackSelect(track)} className="cursor-pointer">
                        <h3 className="font-semibold mb-1 truncate group-hover:text-white transition-colors duration-500 ease-out">{track.title}</h3>
                        <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors duration-500 ease-out">{track.artist}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(track.id);
                          }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 -m-2 ${
                            likedSongs.has(track.id) 
                              ? 'bg-green-500/20 opacity-100' 
                              : 'opacity-0 group-hover:opacity-100 hover:bg-zinc-700/50'
                          }`}
                        >
                          <Heart 
                            size={18} 
                            className={`transition-all duration-300 ${
                              likedSongs.has(track.id) 
                                ? 'fill-green-500 text-green-500 scale-110' 
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddToPlaylist(track);
                          }}
                          className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm -m-2"
                          title="Add to playlist"
                        >
                          <span className="text-white font-bold text-sm">+</span>
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      <NotificationToast />
    </div>
  );
}
