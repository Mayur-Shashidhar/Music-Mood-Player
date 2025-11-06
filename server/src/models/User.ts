import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ITrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audio: string;
  image?: string;
}

export interface IPlaylist {
  id: string;
  name: string;
  tracks: ITrack[];
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  playlists: IPlaylist[];
  likedSongs: ITrack[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const TrackSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, required: true },
  duration: { type: String, required: true },
  audio: { type: String, required: true },
  image: { type: String },
}, { _id: false });

const PlaylistSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tracks: [TrackSchema],
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  playlists: [PlaylistSchema],
  likedSongs: [TrackSchema],
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
