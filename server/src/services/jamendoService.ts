import axios from 'axios';

const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';

export interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  duration: number;
  audio: string;
  audiodownload: string;
  image: string;
  album_image: string;
}

class JamendoService {
  private getClientId(): string {
    return process.env.JAMENDO_CLIENT_ID || '';
  }

  async getTracks(limit: number = 20, tags?: string): Promise<any[]> {
    try {
      const clientId = this.getClientId();
      if (!clientId) {
        console.error('Jamendo Client ID is missing!');
        return [];
      }

      // Random offset to get different tracks each time (0-500 for variety)
      const randomOffset = Math.floor(Math.random() * 500);

      const params: any = {
        client_id: clientId,
        format: 'json',
        limit,
        offset: randomOffset,
        include: 'musicinfo',
        audioformat: 'mp32',
        order: 'popularity_total', // Order by popularity for better quality tracks
      };
      
      console.log(`Requesting Jamendo tracks with offset: ${randomOffset}`);

      if (tags) {
        params.tags = tags;
      }

      const response = await axios.get<{ headers: any; results: any[] }>(`${JAMENDO_BASE_URL}/tracks`, { params });
      
      console.log('Jamendo response status:', response.status);
      console.log('Jamendo response headers:', response.data.headers);
      console.log(`Jamendo API returned ${response.data.results?.length || 0} tracks`);
      
      if (!response.data.results || response.data.results.length === 0) {
        console.log('No tracks found from Jamendo');
        return [];
      }
      
      return response.data.results.map((track: any) => ({
        id: track.id.toString(),
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: this.formatDuration(track.duration),
        audio: track.audio,
        audioDownload: track.audiodownload,
        image: track.album_image || track.image,
        source: 'jamendo'
      }));
    } catch (error: any) {
      console.error('Jamendo API Error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      return [];
    }
  }

  async getTracksByMood(mood: string, limit: number = 20): Promise<any[]> {
    // Jamendo tags that are more commonly used and return results
    const moodTags: { [key: string]: string } = {
      'Happy': 'energetic',  // More common tag
      'Sad': 'sad',          // Simple tag works better
      'Chill': 'chill',      // Works well
      'Focused': 'classical' // More tracks available
    };

    const tags = moodTags[mood] || 'pop';
    console.log(`Fetching tracks for mood: ${mood} with tags: ${tags}`);
    return this.getTracks(limit, tags);
  }

  async searchTracks(query: string, limit: number = 20): Promise<any[]> {
    try {
      const clientId = this.getClientId();
      if (!clientId) {
        return [];
      }

      // Random offset for varied search results (0-200 for search to stay relevant)
      const randomOffset = Math.floor(Math.random() * 200);
      
      const response = await axios.get<{ headers: any; results: any[] }>(`${JAMENDO_BASE_URL}/tracks`, {
        params: {
          client_id: clientId,
          format: 'json',
          limit,
          offset: randomOffset,
          search: query,
          audioformat: 'mp32',
          order: 'popularity_total',
        }
      });
      
      if (!response.data.results || response.data.results.length === 0) {
        return [];
      }


      
      return response.data.results.map((track: any) => ({
        id: track.id.toString(),
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        duration: this.formatDuration(track.duration),
        audio: track.audio,
        audioDownload: track.audiodownload,
        image: track.album_image || track.image,
        source: 'jamendo'
      }));
    } catch (error: any) {
      console.error('Jamendo Search Error:', error.message);
      return [];
    }
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

export default new JamendoService();
