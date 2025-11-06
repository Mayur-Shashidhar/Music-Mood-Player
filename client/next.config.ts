import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '/Users/mayurshadhidhar/Music-Mood-Player/client',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'usercontent.jamendo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgjam1.jamendo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgjam2.jamendo.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};export default nextConfig;
