const API_URL = 'http://localhost:5001/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Auth headers with token
const authHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get current user
export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to get user');
  return response.json();
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// User Playlists
export const getUserPlaylists = async () => {
  const response = await fetch(`${API_URL}/user/playlists`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch playlists');
  const data = await response.json();
  return data.playlists;
};

export const createPlaylist = async (name: string) => {
  const response = await fetch(`${API_URL}/user/playlists`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create playlist');
  return response.json();
};

export const deletePlaylist = async (playlistId: string) => {
  const response = await fetch(`${API_URL}/user/playlists/${playlistId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete playlist');
  return response.json();
};

export const addTrackToPlaylist = async (playlistId: string, track: any) => {
  const response = await fetch(`${API_URL}/user/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(track),
  });
  if (!response.ok) throw new Error('Failed to add track');
  return response.json();
};

export const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
  const response = await fetch(`${API_URL}/user/playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to remove track');
  return response.json();
};

// Liked Songs
export const getLikedSongs = async () => {
  const response = await fetch(`${API_URL}/user/liked-songs`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch liked songs');
  const data = await response.json();
  return data.likedSongs;
};

export const likeSong = async (track: any) => {
  const response = await fetch(`${API_URL}/user/liked-songs`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(track),
  });
  if (!response.ok) throw new Error('Failed to like song');
  return response.json();
};

export const unlikeSong = async (trackId: string) => {
  const response = await fetch(`${API_URL}/user/liked-songs/${trackId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error('Failed to unlike song');
  return response.json();
};
