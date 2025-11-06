# 🎵 Mood Music Player - Full Stack Application

A modern, full-featured music player with **mood-based playlists**, **user authentication**, **persistent data storage**, and a beautiful **Spotify-inspired UI**.

## 🌟 Project Overview

This is a comprehensive music streaming application built with modern web technologies, featuring user authentication, MongoDB integration, and real-time music playback with mood-based recommendations.

## 📁 Project Structure

```
Music-Player/
├── client/                      # Next.js 15 Frontend (React 19 + TypeScript + Tailwind CSS 4)
│   ├── src/
│   │   ├── app/                # Next.js app directory
│   │   ├── components/         # React components
│   │   │   ├── AuthModal.tsx   # Login/Signup modal
│   │   │   ├── dashboard.tsx   # Main content area
│   │   │   ├── player.tsx      # Music player with controls
│   │   │   ├── Queue.tsx       # Playback queue
│   │   │   └── moodSelector.tsx
│   │   ├── services/           # API services
│   │   │   ├── authService.ts  # Authentication API
│   │   │   └── musicService.ts # Music API
│   │   └── data/               # TypeScript types
│   └── package.json
│
├── server/                      # Express.js Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── config/             # Configuration
│   │   │   └── database.ts     # MongoDB connection
│   │   ├── models/             # Mongoose models
│   │   │   └── User.ts         # User schema
│   │   ├── middleware/         # Express middleware
│   │   │   └── auth.ts         # JWT authentication
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── likedSongsRoutes.ts
│   │   │   ├── userPlaylistRoutes.ts
│   │   │   └── musicRoutes.ts
│   │   ├── services/           # Business logic
│   │   │   └── jamendoService.ts
│   │   └── index.ts            # Server entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── AUTH_IMPLEMENTATION.md       # Authentication setup guide
├── TESTING_GUIDE.md            # Testing instructions
└── README.md                   # This file
```

## ✨ Features

### 🎨 Frontend Features
- ✅ **Spotify-inspired dark UI** with smooth animations
- ✅ **4 Mood-based themes** (Happy, Sad, Chill, Focused) with dynamic gradients
- ✅ **Full-featured music player**
  - Play/Pause controls
  - Next/Previous track navigation
  - Progress bar with seek functionality
  - Volume controls
  - Shuffle mode with animated queue
  - Repeat modes (off/all/one)
  - Auto-play on track selection
  - Expandable full-screen player mode
- ✅ **Real-time search** with debouncing (500ms)
- ✅ **Queue management** with shuffle animation
- ✅ **24 Curated playlists** (6 per mood)
- ✅ **User authentication** (Login/Signup)
- ✅ **User playlists** (Create, Edit, Delete)
- ✅ **Liked songs** with persistent storage
- ✅ **Add songs to playlists** from anywhere
- ✅ **Responsive design** with mobile support
- ✅ **Text reveal animation** on page load
- ✅ **Custom music note icon** in browser tab

### 🔐 Authentication & User Features
- ✅ **JWT-based authentication** with 7-day token expiry
- ✅ **Secure password hashing** with bcrypt
- ✅ **Auto-login** on page refresh
- ✅ **Protected routes** requiring authentication
- ✅ **User profile** display in sidebar
- ✅ **Persistent user data** in MongoDB

### 🎵 Backend Features
- ✅ **Jamendo API integration** for royalty-free music (30,000+ tracks)
- ✅ **Randomized track fetching** for variety
- ✅ **Mood-based playlist generation**
- ✅ **Advanced search & discovery**
- ✅ **MongoDB database** for user data
- ✅ **RESTful API** with protected endpoints
- ✅ **CORS configuration** for cross-origin requests
- ✅ **Error handling** and logging

### 🗄️ Database Features
- ✅ **User management** (email, password, name)
- ✅ **Playlists storage** (name, tracks, timestamps)
- ✅ **Liked songs storage** (track details)
- ✅ **Timestamps** (createdAt, updatedAt)
- ✅ **Data persistence** across sessions

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v7.0 or higher)

### 📦 Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/RhiteshKotekar/Music-Player.git
cd Music-Player
```

#### 2. Install MongoDB (macOS)
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

#### 3. Setup Backend Server
```bash
cd server
npm install

# Configure environment variables
# .env file is already set up with:
# - PORT=5001
# - MONGODB_URI=mongodb://localhost:27017/music-player
# - JWT_SECRET=your_jwt_secret_key_change_this_in_production
# - JAMENDO_CLIENT_ID=a3e52d4b

# Start the server
npm run dev
```
✅ Backend will run on `http://localhost:5001`

You should see:
```
✅ MongoDB connected successfully
📊 Database: music-player
🎵 Server is running on http://localhost:5001
```

#### 4. Setup Frontend Client
```bash
cd client
npm install

# Start the development server
npm run dev
```
✅ Frontend will run on `http://localhost:3000`

#### 5. Open in Browser
Navigate to `http://localhost:3000` and start using the app! 🎉

---

## 🔌 API Documentation

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/logout` | Logout (client-side) | No |

### 🎵 Music Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tracks` | Get tracks by mood | No |
| GET | `/api/search` | Search tracks | No |

### 📝 User Playlists Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/playlists` | Get all user playlists | Yes |
| POST | `/api/user/playlists` | Create new playlist | Yes |
| POST | `/api/user/playlists/:id/tracks` | Add track to playlist | Yes |
| DELETE | `/api/user/playlists/:id/tracks/:trackId` | Remove track from playlist | Yes |
| DELETE | `/api/user/playlists/:id` | Delete playlist | Yes |

### ❤️ Liked Songs Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/liked-songs` | Get all liked songs | Yes |
| POST | `/api/user/liked-songs` | Like a song | Yes |
| DELETE | `/api/user/liked-songs/:trackId` | Unlike a song | Yes |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **HTTP Client:** Fetch API
- **State Management:** React Hooks (useState, useEffect)
- **Storage:** localStorage (JWT tokens)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt.js
- **API:** Jamendo Music API
- **HTTP Client:** Axios
- **CORS:** cors middleware

### Database Schema
```typescript
User {
  _id: ObjectId
  email: String (unique)
  password: String (hashed)
  name: String
  playlists: [
    {
      id: String
      name: String
      tracks: [Track]
      createdAt: Date
    }
  ]
  likedSongs: [Track]
  createdAt: Date
  updatedAt: Date
}

Track {
  id: String
  title: String
  artist: String
  album: String
  duration: String
  audio: String (URL)
  image: String (URL)
}
```

---

## 🎮 Usage Guide

### For Users

#### 1. **Sign Up / Login**
- Click "Login / Sign Up" button in the sidebar
- Create a new account or login with existing credentials
- Your session will be saved (auto-login on refresh)

#### 2. **Browse Music**
- Select a mood (Happy, Sad, Chill, Focused)
- Browse 24 curated playlists (6 per mood)
- Click any playlist to view songs
- Use search to find specific tracks

#### 3. **Play Music**
- Click any song to start playing
- Use player controls: play/pause, next/previous
- Adjust volume with the volume slider
- Enable shuffle or repeat modes
- Expand to full-screen player mode

#### 4. **Create Playlists**
- Click "Create Playlist" in sidebar
- Name your playlist
- Add songs from search, playlists, or recommendations
- View and manage your playlists

#### 5. **Like Songs**
- Click the heart ❤️ icon on any song
- View all liked songs in "Liked Songs" section
- Liked songs persist across sessions

#### 6. **Manage Queue**
- View current playback queue in the right sidebar
- Shuffle to randomize queue order
- Click any track in queue to jump to it

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x450?text=Home+Page+Screenshot)

### Full-Screen Player
![Full-Screen Player](https://via.placeholder.com/800x450?text=Full-Screen+Player)

### User Playlists
![User Playlists](https://via.placeholder.com/800x450?text=User+Playlists)

### Search
![Search](https://via.placeholder.com/800x450?text=Search+Results)

---

## 🔒 Security Features

- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Tokens:** Secure token-based authentication
- **Token Expiry:** 7-day automatic expiry
- **Protected Routes:** Authentication middleware
- **CORS:** Configured for localhost:3000
- **Environment Variables:** Sensitive data in .env
- **No API Keys Required:** Uses free Jamendo API

---

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing instructions.

### Quick Test
```bash
# Terminal 1 - Start Backend
cd server && npm run dev

# Terminal 2 - Start Frontend
cd client && npm run dev

# Open browser
open http://localhost:3000
```

### Test Authentication
1. Sign up with new account
2. Verify user info appears in sidebar
3. Create a playlist
4. Like some songs
5. Logout and login again
6. Verify data persists

---

## 📚 Documentation

- **[AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md)** - Complete authentication setup guide
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing instructions

---

## 🎯 Project Highlights

### What Makes This Special?
- ✨ **Full-stack application** with modern architecture
- 🔐 **Complete authentication system** with JWT
- 💾 **Persistent data storage** with MongoDB
- 🎨 **Beautiful UI/UX** inspired by Spotify
- 🎵 **30,000+ free tracks** from Jamendo
- 🔀 **Smart randomization** for varied music discovery
- 📱 **Responsive design** for all devices
- ⚡ **Fast and performant** with Next.js 15
- 🛡️ **Secure** with proper authentication
- 🎭 **Mood-based** intelligent recommendations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

- **Rhitesh Kotekar** - [GitHub](https://github.com/RhiteshKotekar)

---

## 🙏 Acknowledgments

- **Jamendo** for providing free music API
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **MongoDB** for the flexible database
- **Spotify** for UI/UX inspiration

---

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the maintainers.

---

## 🚀 Future Enhancements

- [ ] Social sharing features
- [ ] Collaborative playlists
- [ ] Music recommendations based on listening history
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts
- [ ] Lyrics integration
- [ ] Download for offline listening
- [ ] Mobile app (React Native)
- [ ] Cloud deployment (Vercel + MongoDB Atlas)
- [ ] Artist profiles
- [ ] Album view
- [ ] Recently played section

---

**Built with ❤️ using Next.js, Express, MongoDB, and TypeScript**
- `GET /api/playlists/mood/:mood` - Generate mood-based playlist
  - Moods: Happy, Sad, Chill, Focused
- `GET /api/playlists/recommended` - Get recommended playlist
- `GET /api/playlists/genre/:genre` - Get genre playlist

### Search
- `GET /api/search?q=query` - Search tracks
- `GET /api/search/artist/:artistName` - Search by artist
- `GET /api/search/album/:albumName` - Search by album
- `GET /api/search/suggest?q=query` - Get search suggestions

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide Icons

### Backend
- Node.js
- Express
- TypeScript
- Axios
- Free Music APIs (Jamendo & Deezer)

## API Keys (Optional)

For better rate limits and features, you can get free API keys:

1. **Jamendo** - https://devportal.jamendo.com/
2. **Last.fm** - https://www.last.fm/api/account/create

Add them to `server/.env` file.

## Scripts

### Frontend (client/)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Backend (server/)
```bash
npm run dev      # Start development server with auto-reload

