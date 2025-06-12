
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAudio } from '@/contexts/AudioContext';
import AnimatedList from './AnimatedList';
import ChromaGrid from './ChromaGrid';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, MoreHorizontal, Music, Album, List, Grid } from 'lucide-react';

interface AudioPageProps {
  isDarkMode: boolean;
}

const AudioPage: React.FC<AudioPageProps> = ({ isDarkMode }) => {
  const { currentTrack, isPlaying, play, pause, next, previous } = useAudio();
  const [viewMode, setViewMode] = useState<'songs' | 'albums' | 'playlists'>('songs');

  const sampleSongs = [
    'Midnight Dreams - Lo-Fi Collective',
    'Electric Pulse - Synthwave Masters',
    'Coffee Shop Vibes - Jazz Ensemble',
    'Ocean Waves - Ambient Sounds',
    'City Lights - Electronic Beats',
    'Summer Nights - Indie Pop',
    'Retro Future - 80s Revival',
    'Calm Waters - Meditation Music',
    'Underground - Hip Hop Culture',
    'Starlight - Dream Pop',
    'Digital Love - Cyberpunk Anthem',
    'Morning Coffee - Acoustic Sessions',
    'Neon Glow - Synthpop Classics',
    'Deep Space - Ambient Journey',
    'Urban Flow - Modern Hip Hop'
  ];

  const sampleAlbums = [
    {
      image: "https://picsum.photos/300/300?random=1",
      title: "Midnight Vibes",
      subtitle: "Lo-Fi Hip Hop Collection",
      handle: "2023 • 24 tracks",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg, #4F46E5, #000)",
      url: "#",
    },
    {
      image: "https://picsum.photos/300/300?random=2",
      title: "Electric Dreams",
      subtitle: "Synthwave Essentials",
      handle: "2023 • 18 tracks",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg, #10B981, #000)",
      url: "#",
    },
    {
      image: "https://picsum.photos/300/300?random=3",
      title: "Coffee Shop Jazz",
      subtitle: "Smooth Jazz Instrumentals",
      handle: "2022 • 15 tracks",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
      url: "#",
    },
    {
      image: "https://picsum.photos/300/300?random=4",
      title: "Ocean Waves",
      subtitle: "Ambient Nature Sounds",
      handle: "2023 • 12 tracks",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg, #EF4444, #000)",
      url: "#",
    },
    {
      image: "https://picsum.photos/300/300?random=5",
      title: "City Lights",
      subtitle: "Electronic Beats",
      handle: "2023 • 20 tracks",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
      url: "#",
    },
    {
      image: "https://picsum.photos/300/300?random=6",
      title: "Summer Breeze",
      subtitle: "Indie Pop Favorites",
      handle: "2022 • 16 tracks",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4, #000)",
      url: "#",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Audio Center
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'songs' ? 'default' : 'outline'}
            onClick={() => setViewMode('songs')}
            className="rounded-full"
          >
            <List className="h-4 w-4 mr-2" />
            Songs
          </Button>
          <Button
            variant={viewMode === 'albums' ? 'default' : 'outline'}
            onClick={() => setViewMode('albums')}
            className="rounded-full"
          >
            <Grid className="h-4 w-4 mr-2" />
            Albums
          </Button>
          <Button
            variant={viewMode === 'playlists' ? 'default' : 'outline'}
            onClick={() => setViewMode('playlists')}
            className="rounded-full"
          >
            <Music className="h-4 w-4 mr-2" />
            Playlists
          </Button>
        </div>
      </div>

      {/* Now Playing */}
      {currentTrack && (
        <Card className={`p-6 border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/5 border-white/10 hover:bg-white/8' 
            : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
        } backdrop-blur-md rounded-3xl shadow-2xl`}>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Music className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentTrack.title}
              </h3>
              <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentTrack.artist}
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  onClick={previous}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={isPlaying ? pause : play}
                  className="rounded-full w-16 h-16 p-0"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <Button
                  size="sm"
                  onClick={next}
                  className="rounded-full w-12 h-12 p-0"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Repeat className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Content based on view mode */}
      {viewMode === 'songs' && (
        <Card className={`p-6 border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/5 border-white/10 hover:bg-white/8' 
            : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
        } backdrop-blur-md rounded-3xl shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Songs
            </h3>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {sampleSongs.length} tracks
            </Badge>
          </div>
          <AnimatedList
            items={sampleSongs}
            onItemSelect={(item, index) => {
              console.log('Selected song:', item, 'at index:', index);
            }}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
        </Card>
      )}

      {viewMode === 'albums' && (
        <Card className={`p-6 border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/5 border-white/10 hover:bg-white/8' 
            : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
        } backdrop-blur-md rounded-3xl shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Albums
            </h3>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {sampleAlbums.length} albums
            </Badge>
          </div>
          <div style={{ height: '600px', position: 'relative' }}>
            <ChromaGrid 
              items={sampleAlbums}
              radius={300}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </Card>
      )}

      {viewMode === 'playlists' && (
        <Card className={`p-6 border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-white/5 border-white/10 hover:bg-white/8' 
            : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
        } backdrop-blur-md rounded-3xl shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Playlists
            </h3>
            <Button className="rounded-full">
              Create Playlist
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Favorites', 'Workout Mix', 'Chill Vibes', 'Study Focus', 'Party Hits', 'Road Trip'].map((playlist, index) => (
              <Card key={index} className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {playlist}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {Math.floor(Math.random() * 50) + 10} songs
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AudioPage;
