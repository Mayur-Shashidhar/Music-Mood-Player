# Music Player Backend API

A Node.js/Express backend service that provides music tracks, mood-based playlists, and search functionality using free music APIs.

## Features

### 1. **Music Tracks** 
- Fetch tracks from multiple free sources (Jamendo, Deezer)
- Get trending/chart tracks
- Filter by genre

### 2. **Mood-Based Playlists**
- Generate playlists based on mood (Happy, Sad, Chill, Focused)
- Recommended daily mix
- Genre-specific playlists

### 3. **Search & Discovery**
- Search tracks across multiple sources
- Search by artist or album
- Autocomplete suggestions

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Add your API keys to `.env` (optional but recommended):
   - **Jamendo**: Get free API key at https://devportal.jamendo.com/
   - **Last.fm**: Get free API key at https://www.last.fm/api/account/create

4. Build TypeScript:
```bash
npm run build
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Tracks

#### Get Tracks
```
GET /api/tracks?limit=20&source=all
```
Parameters:
- `limit` (optional): Number of tracks to return (default: 20)
- `source` (optional): 'jamendo', 'deezer', or 'all' (default: all)

#### Get Trending Tracks
```
GET /api/tracks/trending?limit=20
```

#### Get Tracks by Genre
```
GET /api/tracks/genre/:genreId?limit=20
```

### Playlists

#### Get Mood-Based Playlist
```
GET /api/playlists/mood/:mood?limit=20
```
Moods: `Happy`, `Sad`, `Chill`, `Focused`

Example:
```
GET /api/playlists/mood/Happy?limit=30
```

#### Get Recommended Playlist
```
GET /api/playlists/recommended?limit=30
```

#### Get Genre Playlist
```
GET /api/playlists/genre/:genre?limit=20
```
Genres: `pop`, `rock`, `jazz`, `electronic`, `hiphop`, `classical`, `rnb`, `country`

### Search

#### Search Tracks
```
GET /api/search?q=query&limit=20&source=all
```
Parameters:
- `q` (required): Search query
- `limit` (optional): Number of results (default: 20)
- `source` (optional): 'jamendo', 'deezer', or 'all'

#### Search by Artist
```
GET /api/search/artist/:artistName?limit=20
```

#### Search by Album
```
GET /api/search/album/:albumName?limit=20
```

#### Get Suggestions
```
GET /api/search/suggest?q=query
```

## Response Format

### Success Response
```json
{
  "success": true,
  "count": 20,
  "tracks": [
    {
      "id": "123",
      "title": "Song Title",
      "artist": "Artist Name",
      "album": "Album Name",
      "duration": "3:45",
      "audio": "https://...",
      "image": "https://...",
      "source": "jamendo"
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Free Music APIs Used

1. **Jamendo** - Royalty-free music
   - No account required for basic usage
   - Get client ID for better rate limits
   - URL: https://devportal.jamendo.com/

2. **Deezer** - Music streaming service
   - No API key required for search and previews
   - Provides 30-second previews
   - URL: https://developers.deezer.com/

## Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## Notes

- Deezer API provides 30-second previews for free
- Jamendo provides full-length tracks (requires client ID)
- Both APIs are rate-limited but sufficient for development
- For production, consider caching responses

## License

MIT
