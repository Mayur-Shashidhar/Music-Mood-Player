import express, { Request, Response } from 'express';
import jamendoService from '../services/jamendoService';
import deezerService from '../services/deezerService';

const router = express.Router();

// Search tracks across multiple services
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const source = req.query.source as string || 'all';

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    let tracks: any[] = [];

    // Search across different sources
    if (source === 'jamendo' || source === 'all') {
      const jamendoTracks = await jamendoService.searchTracks(query, limit);
      tracks = [...tracks, ...jamendoTracks];
    }

    if (source === 'deezer' || source === 'all') {
      const deezerTracks = await deezerService.searchTracks(query, limit);
      tracks = [...tracks, ...deezerTracks];
    }

    res.json({
      success: true,
      query,
      count: tracks.length,
      results: tracks
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      message: error.message 
    });
  }
});

// Search by artist
router.get('/artist/:artistName', async (req: Request, res: Response) => {
  try {
    const artistName = req.params.artistName;
    const limit = parseInt(req.query.limit as string) || 20;

    const tracks = await deezerService.searchTracks(`artist:"${artistName}"`, limit);

    res.json({
      success: true,
      artist: artistName,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Artist search failed',
      message: error.message 
    });
  }
});

// Search by album
router.get('/album/:albumName', async (req: Request, res: Response) => {
  try {
    const albumName = req.params.albumName;
    const limit = parseInt(req.query.limit as string) || 20;

    const tracks = await deezerService.searchTracks(`album:"${albumName}"`, limit);

    res.json({
      success: true,
      album: albumName,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Album search failed',
      message: error.message 
    });
  }
});

// Autocomplete/suggestions
router.get('/suggest', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 2 characters'
      });
    }

    const tracks = await deezerService.searchTracks(query, 5);
    
    const suggestions = tracks.map(track => ({
      title: track.title,
      artist: track.artist,
      type: 'track'
    }));

    res.json({
      success: true,
      query,
      suggestions
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Suggestions failed',
      message: error.message 
    });
  }
});

export default router;
