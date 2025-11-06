import express, { Request, Response } from 'express';
import jamendoService from '../services/jamendoService';
import deezerService from '../services/deezerService';

const router = express.Router();

// Debug endpoint to check API status
router.get('/debug', async (req: Request, res: Response) => {
  try {
    const axios = require('axios');
    const jamendoId = process.env.JAMENDO_CLIENT_ID;
    
    // Test Jamendo API directly with axios
    const directResponse = await axios.get('https://api.jamendo.com/v3.0/tracks', {
      params: {
        client_id: jamendoId,
        format: 'json',
        limit: 2,
        tags: 'chill',
        audioformat: 'mp32'
      }
    });
    
    // Test through service
    const jamendoTracks = await jamendoService.getTracks(2, 'chill');
    
    res.json({
      jamendoClientId: jamendoId ? `${jamendoId.substring(0, 4)}...` : 'MISSING',
      envLoaded: !!process.env.NODE_ENV,
      directAxiosResults: directResponse.data.results?.length || 0,
      serviceResults: jamendoTracks.length,
      sampleTrack: jamendoTracks[0] || directResponse.data.results?.[0] || null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Get tracks from multiple sources
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const source = req.query.source as string || 'all';

    let tracks: any[] = [];

    if (source === 'jamendo' || source === 'all') {
      const jamendoTracks = await jamendoService.getTracks(limit);
      tracks = [...tracks, ...jamendoTracks];
    }

    if (source === 'deezer' || source === 'all') {
      const deezerTracks = await deezerService.getChart(limit);
      tracks = [...tracks, ...deezerTracks];
    }

    res.json({
      success: true,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch tracks',
      message: error.message 
    });
  }
});

// Get trending/chart tracks
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const tracks = await deezerService.getChart(limit);

    res.json({
      success: true,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch trending tracks',
      message: error.message 
    });
  }
});

// Get tracks by genre
router.get('/genre/:genreId', async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.genreId);
    const limit = parseInt(req.query.limit as string) || 20;
    
    const tracks = await deezerService.getTracksByGenre(genreId, limit);

    res.json({
      success: true,
      count: tracks.length,
      tracks
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch genre tracks',
      message: error.message 
    });
  }
});

export default router;
