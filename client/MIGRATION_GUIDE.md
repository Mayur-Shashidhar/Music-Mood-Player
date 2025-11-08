# Music Mood Player - API Routes Migration Guide

## Migration Complete! 🎉

All server routes have been successfully migrated to Next.js API routes in the `/client/src/app/api` directory.

## Setup Instructions

### 1. Install Required Dependencies

```bash
cd client
npm install mongoose bcryptjs jsonwebtoken axios
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 2. Environment Variables

Create a `.env.local` file in the client folder:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your configuration:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-random-secret
JAMENDO_CLIENT_ID=your-jamendo-client-id
```

**Note:** These environment variables are for server-side API routes only. Do NOT add `NEXT_PUBLIC_` prefix.

### 3. Start the Next.js Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user info (requires auth)
- `POST /api/auth/logout` - Logout (client-side token removal)
- `PUT /api/auth/change-password` - Change password (requires auth)
- `DELETE /api/auth/delete-account` - Delete user account (requires auth)

### Music Tracks (`/api/tracks`)
- `GET /api/tracks` - Get tracks from multiple sources
  - Query params: `limit`, `source` (jamendo/deezer/all)
- `GET /api/tracks/trending` - Get trending/chart tracks
- `GET /api/tracks/genre/[genreId]` - Get tracks by genre ID

### Playlists (`/api/playlists`)
- `GET /api/playlists/mood/[mood]` - Generate playlist by mood
  - Valid moods: Happy, Sad, Chill, Focused
- `GET /api/playlists/recommended` - Get recommended daily mix

### Search (`/api/search`)
- `GET /api/search?q=query` - Search tracks
  - Query params: `q`, `limit`, `source`
- `GET /api/search/artist/[artistName]` - Search by artist
- `GET /api/search/album/[albumName]` - Search by album

### User Playlists (`/api/user/playlists`) - Requires Authentication
- `GET /api/user/playlists` - Get user's playlists
- `POST /api/user/playlists` - Create new playlist
- `DELETE /api/user/playlists/[playlistId]` - Delete playlist
- `POST /api/user/playlists/[playlistId]/tracks` - Add track to playlist
- `DELETE /api/user/playlists/[playlistId]/tracks/[trackId]` - Remove track

### Liked Songs (`/api/user/liked-songs`) - Requires Authentication
- `GET /api/user/liked-songs` - Get liked songs
- `POST /api/user/liked-songs` - Like a song
- `DELETE /api/user/liked-songs/[trackId]` - Unlike a song

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
client/src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── signup/route.ts
│       │   ├── login/route.ts
│       │   ├── me/route.ts
│       │   ├── logout/route.ts
│       │   ├── change-password/route.ts
│       │   └── delete-account/route.ts
│       ├── tracks/
│       │   ├── route.ts
│       │   ├── trending/route.ts
│       │   └── genre/[genreId]/route.ts
│       ├── playlists/
│       │   ├── mood/[mood]/route.ts
│       │   └── recommended/route.ts
│       ├── search/
│       │   ├── route.ts
│       │   ├── artist/[artistName]/route.ts
│       │   └── album/[albumName]/route.ts
│       └── user/
│           ├── playlists/
│           │   ├── route.ts
│           │   ├── [playlistId]/route.ts
│           │   └── [playlistId]/tracks/
│           │       ├── route.ts
│           │       └── [trackId]/route.ts
│           └── liked-songs/
│               ├── route.ts
│               └── [trackId]/route.ts
├── lib/
│   ├── database.ts
│   ├── auth.ts
│   └── services/
│       ├── jamendoService.ts
│       └── deezerService.ts
└── models/
    └── User.ts
```

## Next Steps

1. **Update your frontend code** to call the new Next.js API routes instead of the Express server:
   - Change base URL from `http://localhost:5001/api` to `/api`
   - Update all fetch/axios calls in your components

2. **Test all endpoints** to ensure they work correctly

3. **Remove the old server** once everything is verified:
   ```bash
   # Optional: You can keep the server folder for reference
   rm -rf server
   ```

## Benefits of Migration

✅ **Single codebase** - Frontend and backend in one Next.js project  
✅ **Better deployment** - Deploy everything together on Vercel/Netlify  
✅ **Improved DX** - No need to run separate dev servers  
✅ **Edge functions** - Deploy API routes to edge networks  
✅ **TypeScript everywhere** - Type safety across your entire stack  

Enjoy your fully integrated Next.js music player! 🎵
