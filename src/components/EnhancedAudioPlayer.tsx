
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAudio } from '@/contexts/AudioContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  Music,
  MoreHorizontal
} from 'lucide-react';

interface EnhancedAudioPlayerProps {
  isDarkMode: boolean;
  compact?: boolean;
}

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({ isDarkMode, compact = false }) => {
  const { currentTrack, isPlaying, play, pause, next, previous } = useAudio();
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [isLiked, setIsLiked] = useState(false);

  // Simulate time progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            next();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, next]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = Math.round(value[0]);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(Math.round(value[0]));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (compact) {
    return (
      <Card className={`p-4 border transition-all duration-500 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
          : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
      } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Audio Player
          </h3>
          <Badge variant="outline" className="text-sm">
            {currentTrack ? 'Playing' : 'Stopped'}
          </Badge>
        </div>

        {currentTrack && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentTrack.title}
                </h4>
                <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Button size="sm" onClick={previous} className="rounded-full">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={isPlaying ? pause : play}
                className="rounded-full w-10 h-10 p-0"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" onClick={next} className="rounded-full">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleTimeChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}

        {!currentTrack && (
          <div className="text-center py-8">
            <Music className={`h-12 w-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No track selected
            </p>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={`p-6 border transition-all duration-500 ${
      isDarkMode 
        ? 'bg-white/5 border-white/10 hover:bg-white/8' 
        : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
    } backdrop-blur-md rounded-3xl shadow-2xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Enhanced Audio Player
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant={currentTrack ? 'default' : 'secondary'} className="text-sm">
            {currentTrack ? 'Playing' : 'Stopped'}
          </Badge>
          <Button variant="ghost" size="sm" className="rounded-full">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {currentTrack ? (
        <div className="space-y-6">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentTrack.title}
              </h4>
              <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentTrack.artist}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Album: {currentTrack.album || 'Unknown Album'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              className={`rounded-full ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleTimeChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleShuffle}
              className={`rounded-full ${isShuffleOn ? 'text-blue-500' : ''}`}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            
            <Button size="sm" onClick={previous} className="rounded-full">
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              onClick={isPlaying ? pause : play}
              className="rounded-full w-14 h-14 p-0"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button size="sm" onClick={next} className="rounded-full">
              <SkipForward className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRepeat}
              className={`rounded-full ${repeatMode !== 'off' ? 'text-blue-500' : ''}`}
            >
              <Repeat className="h-5 w-5" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs flex items-center justify-center text-white">
                  1
                </span>
              )}
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="rounded-full"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <div className="flex-1">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
            
            <span className={`text-sm w-8 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isMuted ? 0 : Math.round(volume)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Music className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No track selected
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Choose a song to start playing
          </p>
          <Button className="mt-4" onClick={() => play()}>
            <Play className="h-4 w-4 mr-2" />
            Start Playing
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EnhancedAudioPlayer;
