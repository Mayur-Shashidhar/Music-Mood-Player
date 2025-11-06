import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import musicRoutes from './routes/musicRoutes';
import playlistRoutes from './routes/playlistRoutes';
import searchRoutes from './routes/searchRoutes';
import authRoutes from './routes/authRoutes';
import userPlaylistRoutes from './routes/userPlaylistRoutes';
import likedSongsRoutes from './routes/likedSongsRoutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Music Player API', 
    version: '1.0.0',
    endpoints: {
      tracks: '/api/tracks',
      playlists: '/api/playlists',
      search: '/api/search'
    }
  });
});

app.use('/api/tracks', musicRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user/playlists', userPlaylistRoutes);
app.use('/api/user/liked-songs', likedSongsRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🎵 Server is running on http://localhost:${PORT}`);
});
