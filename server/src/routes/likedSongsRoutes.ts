import express, { Response } from 'express';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get liked songs
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ likedSongs: user.likedSongs });
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching liked songs', details: error.message });
  }
});

// Like a song (add to liked songs)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const track = req.body;

    if (!track || !track.id) {
      return res.status(400).json({ error: 'Track data is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if song is already liked
    const alreadyLiked = user.likedSongs.some((t) => t.id === track.id);
    if (alreadyLiked) {
      return res.status(400).json({ error: 'Song already liked' });
    }

    user.likedSongs.push(track);
    await user.save();

    res.json({ message: 'Song liked', likedSongs: user.likedSongs });
  } catch (error: any) {
    res.status(500).json({ error: 'Error liking song', details: error.message });
  }
});

// Unlike a song (remove from liked songs)
router.delete('/:trackId', async (req: AuthRequest, res: Response) => {
  try {
    const { trackId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.likedSongs = user.likedSongs.filter((t) => t.id !== trackId);
    await user.save();

    res.json({ message: 'Song unliked', likedSongs: user.likedSongs });
  } catch (error: any) {
    res.status(500).json({ error: 'Error unliking song', details: error.message });
  }
});

export default router;
