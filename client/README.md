# 🎵 Music Mood Player

A full-stack Next.js music player application that curates playlists based on your mood. Built with Next.js 16, MongoDB, and integrated with Jamendo and Deezer APIs.

## ✨ Features

- 🎭 **Mood-based Playlists**: Generate playlists based on Happy, Sad, Chill, or Focused moods
- 🔐 **User Authentication**: Secure signup/login with JWT tokens
- ❤️ **Liked Songs**: Save your favorite tracks
- 📝 **Custom Playlists**: Create and manage your own playlists
- 🔍 **Smart Search**: Search tracks, artists, and albums
- 🎵 **Multiple Sources**: Integrates Jamendo (full tracks) and Deezer (previews)
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas)
- Jamendo API key ([Get one here](https://devportal.jamendo.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mayur-Shashidhar/Music-Mood-Player.git
   cd Music-Mood-Player/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `client` folder:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your API keys and configuration:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secure-random-secret
   JAMENDO_CLIENT_ID=your-jamendo-client-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

Create a `.env.local` file in the client folder with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/music-player
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Secret (use a strong random string)
JWT_SECRET=your-secure-random-secret-key

# Jamendo API Client ID
JAMENDO_CLIENT_ID=your-jamendo-client-id
```

**Important:** These variables are used server-side in API routes. Do NOT prefix them with `NEXT_PUBLIC_`.

### Getting API Keys

1. **Jamendo API**: 
   - Sign up at [Jamendo Developer Portal](https://devportal.jamendo.com)
   - Create an application to get your Client ID

2. **MongoDB Atlas** (if not using local MongoDB):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── tracks/       # Music tracks endpoints
│   │   │   ├── playlists/    # Playlist generation
│   │   │   ├── search/       # Search functionality
│   │   │   └── user/         # User-specific data
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # React components
│   ├── lib/                  # Utilities and services
│   │   ├── auth.ts          # Auth helpers
│   │   ├── database.ts      # MongoDB connection
│   │   └── services/        # External API services
│   ├── models/              # MongoDB schemas
│   └── data/                # Static data
├── public/                   # Static assets
├── .env.local.example       # Environment template
└── package.json
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/delete-account` - Delete account

### Music & Playlists
- `GET /api/tracks` - Get tracks
- `GET /api/tracks/trending` - Trending tracks
- `GET /api/playlists/mood/[mood]` - Mood-based playlist
- `GET /api/playlists/recommended` - Daily mix

### Search
- `GET /api/search?q=query` - Search tracks
- `GET /api/search/artist/[name]` - Search by artist
- `GET /api/search/album/[name]` - Search by album

### User Features (Protected)
- `GET /api/user/playlists` - User's playlists
- `POST /api/user/playlists` - Create playlist
- `GET /api/user/liked-songs` - Liked songs
- `POST /api/user/liked-songs` - Like a song

Full API documentation: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Styling**: Tailwind CSS
- **APIs**: Jamendo API, Deezer API
- **HTTP Client**: Axios

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "16.0.0",
    "react": "19.2.0",
    "mongoose": "^8.19.3",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.2",
    "axios": "^1.13.2"
  }
}
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `JAMENDO_CLIENT_ID`

## 📝 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Mayur Shadhidhar**
- GitHub: [@Mayur-Shashidhar](https://github.com/Mayur-Shashidhar)

## 🙏 Acknowledgments

- [Jamendo](https://www.jamendo.com) for music API
- [Deezer](https://www.deezer.com) for music API
- [Next.js](https://nextjs.org) team for the amazing framework

---

Made with ❤️ and 🎵
