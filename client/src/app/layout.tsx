import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Mood Player",
  description: "A music player that curates playlists based on your mood",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
