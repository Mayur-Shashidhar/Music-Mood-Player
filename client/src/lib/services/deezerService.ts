import axios from 'axios';

const DEEZER_BASE_URL = 'https://api.deezer.com';

class DeezerService {
  async searchTracks(query: string, limit: number = 20): Promise<any[]> {
    try {
      const response = await axios.get<{ data: any[] }>(`${DEEZER_BASE_URL}/search`, {
        params: {
          q: query,
          limit
        }
      });

      return response.data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: this.formatDuration(track.duration),
        preview: track.preview,
        image: track.album.cover_xl || track.album.cover_big,
        source: 'deezer'
      }));
    } catch (error) {
      console.error('Deezer API Error:', error);
      return [];
    }
  }

  async getTracksByGenre(genreId: number, limit: number = 20): Promise<any[]> {
    try {
      const response = await axios.get<{ data: any[] }>(`${DEEZER_BASE_URL}/genre/${genreId}/artists`);
      const artists = response.data.data.slice(0, 5);
      
      const tracks: any[] = [];
      for (const artist of artists) {
        const artistTracks = await this.getArtistTopTracks(artist.id, 4);
        tracks.push(...artistTracks);
        if (tracks.length >= limit) break;
      }
      
      return tracks.slice(0, limit);
    } catch (error) {
      console.error('Deezer Genre Error:', error);
      return [];
    }
  }

  async getArtistTopTracks(artistId: number, limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get<{ data: any[] }>(`${DEEZER_BASE_URL}/artist/${artistId}/top`, {
        params: { limit }
      });

      return response.data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: this.formatDuration(track.duration),
        preview: track.preview,
        image: track.album.cover_xl || track.album.cover_big,
        source: 'deezer'
      }));
    } catch (error) {
      console.error('Deezer Artist Error:', error);
      return [];
    }
  }

  async getChart(limit: number = 20): Promise<any[]> {
    try {
      const response = await axios.get<{ data: any[] }>(`${DEEZER_BASE_URL}/chart/0/tracks`, {
        params: { limit }
      });

      return response.data.data.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: this.formatDuration(track.duration),
        preview: track.preview,
        image: track.album.cover_xl || track.album.cover_big,
        source: 'deezer'
      }));
    } catch (error) {
      console.error('Deezer Chart Error:', error);
      return [];
    }
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

export default new DeezerService();
