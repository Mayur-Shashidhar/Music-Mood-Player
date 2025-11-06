import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });
};

// Sign Up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      playlists: [],
      likedSongs: [],
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Return user without password
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      playlists: user.playlists,
      likedSongs: user.likedSongs,
    };

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    // Return user without password
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      playlists: user.playlists,
      likedSongs: user.likedSongs,
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      playlists: user.playlists,
      likedSongs: user.likedSongs,
    };

    res.json({ user: userResponse });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Error fetching user', details: error.message });
  }
});

// Logout (client-side will handle token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logout successful' });
});

export default router;
