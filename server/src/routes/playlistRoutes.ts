import express, { Request, Response } from 'express';
import jamendoService from '../services/jamendoService';
import deezerService from '../services/deezerService';

const router = express.Router();

// Generate playlist based on mood
router.get('/mood/:mood', async (req: Request, res: Response) => {
  try {
    const mood = req.params.mood;
    const limit = parseInt(req.query.limit as string) || 20;
    const validMoods = ['Happy', 'Sad', 'Chill', 'Focused'];

    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid mood',
        validMoods
      });
    }

    let tracks: any[] = [];

    // Try Jamendo first (full tracks)
    try {
      tracks = await jamendoService.getTracksByMood(mood, limit);
      console.log(`Jamendo returned ${tracks.length} tracks for mood ${mood}`);
    } catch (error) {
      console.log('Jamendo failed, trying Deezer...');
    }

    // Fallback to Deezer if Jamendo returns no tracks
    if (tracks.length === 0) {
      const moodSearchTerms: { [key: string]: string } = {
        'Happy': 'happy upbeat pop',
        'Sad': 'sad emotional ballad',
        'Chill': 'chill lofi ambient',
        'Focused': 'instrumental focus classical'
      };
      const searchTerm = moodSearchTerms[mood] || 'popular music';
      tracks = await deezerService.searchTracks(searchTerm, limit);
      console.log(`Deezer returned ${tracks.length} tracks for mood ${mood}`);
    }

    res.json({
      success: true,
      mood,
      count: tracks.length,
      playlist: {
        name: `${mood} Mix`,
        description: getMoodDescription(mood),
        tracks
      }
    });
  } catch (error: any) {
    console.error('Playlist generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate mood playlist',
      message: error.message 
    });
  }
});

// Generate recommended playlist
router.get('/recommended', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30;
    
    // Mix tracks from different moods
    const moods = ['Happy', 'Chill', 'Focused'];
    const tracksPerMood = Math.ceil(limit / moods.length);
    
    let allTracks: any[] = [];
    
    for (const mood of moods) {
      const tracks = await jamendoService.getTracksByMood(mood, tracksPerMood);
      allTracks = [...allTracks, ...tracks];
    }

    // Shuffle the tracks
    allTracks = shuffleArray(allTracks).slice(0, limit);

    res.json({
      success: true,
      count: allTracks.length,
      playlist: {
        name: 'Your Daily Mix',
        description: 'A personalized mix just for you',
        tracks: allTracks
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate recommended playlist',
      message: error.message 
    });
  }
});

// Get playlist by genre
router.get('/genre/:genre', async (req: Request, res: Response) => {
  try {
    const genre = req.params.genre;
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Deezer genre IDs
    const genreMap: { [key: string]: number } = {
      'pop': 132,
      'rock': 152,
      'jazz': 129,
      'electronic': 106,
      'hiphop': 116,
      'classical': 98,
      'rnb': 165,
      'country': 2
    };

    const genreId = genreMap[genre.toLowerCase()] || 132;
    const tracks = await deezerService.getTracksByGenre(genreId, limit);

    res.json({
      success: true,
      genre,
      count: tracks.length,
      playlist: {
        name: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Hits`,
        description: `Best ${genre} tracks`,
        tracks
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate genre playlist',
      message: error.message 
    });
  }
});

// Helper functions
function getMoodDescription(mood: string): string {
  const descriptions: { [key: string]: string } = {
    'Happy': 'Uplifting and energetic vibes to boost your mood',
    'Sad': 'Melancholic and reflective tunes for contemplation',
    'Chill': 'Relaxed and laid-back sounds to unwind',
    'Focused': 'Deep concentration music for productivity'
  };
  return descriptions[mood] || 'A curated playlist for you';
}

function shuffleArray(array: any[]): any[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default router;
