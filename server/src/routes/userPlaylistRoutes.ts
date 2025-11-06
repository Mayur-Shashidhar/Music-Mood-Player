import express, { Response } from 'express';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user playlists
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ playlists: user.playlists });
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching playlists', details: error.message });
  }
});

// Create new playlist
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
    };

    user.playlists.push(newPlaylist);
    await user.save();

    res.status(201).json({ message: 'Playlist created', playlist: newPlaylist });
  } catch (error: any) {
    res.status(500).json({ error: 'Error creating playlist', details: error.message });
  }
});

// Add track to playlist
router.post('/:playlistId/tracks', async (req: AuthRequest, res: Response) => {
  try {
    const { playlistId } = req.params;
    const track = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playlist = user.playlists.find((p) => p.id === playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if track already exists
    const trackExists = playlist.tracks.some((t) => t.id === track.id);
    if (trackExists) {
      return res.status(400).json({ error: 'Track already in playlist' });
    }

    playlist.tracks.push(track);
    await user.save();

    res.json({ message: 'Track added to playlist', playlist });
  } catch (error: any) {
    res.status(500).json({ error: 'Error adding track', details: error.message });
  }
});

// Remove track from playlist
router.delete('/:playlistId/tracks/:trackId', async (req: AuthRequest, res: Response) => {
  try {
    const { playlistId, trackId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const playlist = user.playlists.find((p) => p.id === playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    playlist.tracks = playlist.tracks.filter((t) => t.id !== trackId);
    await user.save();

    res.json({ message: 'Track removed from playlist', playlist });
  } catch (error: any) {
    res.status(500).json({ error: 'Error removing track', details: error.message });
  }
});

// Delete playlist
router.delete('/:playlistId', async (req: AuthRequest, res: Response) => {
  try {
    const { playlistId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.playlists = user.playlists.filter((p) => p.id !== playlistId);
    await user.save();

    res.json({ message: 'Playlist deleted' });
  } catch (error: any) {
    res.status(500).json({ error: 'Error deleting playlist', details: error.message });
  }
});

export default router;
