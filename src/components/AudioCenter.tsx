
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Shuffle, 
  Repeat,
  Music,
  Radio
} from 'lucide-react';

interface AudioCenterProps {
  isDarkMode: boolean;
  compact?: boolean;
}

const AudioCenter: React.FC<AudioCenterProps> = ({ isDarkMode, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTrack] = useState({
    title: 'Drive Time Playlist',
    artist: 'Mixed Artists',
    duration: 245,
    progress: 120
  });

  const CircularAudioControl = ({ icon: Icon, onClick, active = false, size = 'md' }) => {
    const sizeClasses = {
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    return (
      <Button
        onClick={onClick}
        className={`
          ${sizeClasses[size]} rounded-full p-0 transition-all duration-300 hover:scale-105
          ${active 
            ? 'bg-purple-500 shadow-lg shadow-purple-500/50' 
            : 'bg-white/10 hover:bg-white/20'
          }
        `}
      >
        <Icon className="h-5 w-5" />
      </Button>
    );
  };

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Music className="h-4 w-4 mr-2 text-purple-400" />
            Audio
          </h3>
          <Button size="sm" variant="outline" className="rounded-full">
            <Radio className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Current Track */}
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <p className="font-medium text-sm truncate">{currentTrack.title}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentTrack.artist}
            </p>
            
            {/* Progress bar */}
            <div className="mt-2">
              <div className={`w-full h-1 rounded-full ${
                isDarkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full"
                  style={{ width: `${(currentTrack.progress / currentTrack.duration) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Circular Controls */}
          <div className="flex items-center justify-center space-x-4">
            <CircularAudioControl 
              icon={SkipBack} 
              onClick={() => console.log('Previous')}
              size="sm"
            />
            <CircularAudioControl 
              icon={isPlaying ? Pause : Play} 
              onClick={() => setIsPlaying(!isPlaying)}
              active={isPlaying}
              size="lg"
            />
            <CircularAudioControl 
              icon={SkipForward} 
              onClick={() => console.log('Next')}
              size="sm"
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-8">{volume[0]}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center">
        <Music className="h-5 w-5 mr-2 text-purple-400" />
        Audio Control Center
      </h3>

      {/* Current Track Display */}
      <div className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-white/5' : 'bg-gray-50'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">{currentTrack.title}</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentTrack.artist}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full ${
          isDarkMode ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentTrack.progress / currentTrack.duration) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{Math.floor(currentTrack.progress / 60)}:{(currentTrack.progress % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Circular Audio Controls */}
      <div className="flex items-center justify-center space-x-6">
        <CircularAudioControl 
          icon={SkipBack} 
          onClick={() => console.log('Previous track')}
        />
        <CircularAudioControl 
          icon={isPlaying ? Pause : Play} 
          onClick={() => setIsPlaying(!isPlaying)}
          active={isPlaying}
          size="lg"
        />
        <CircularAudioControl 
          icon={SkipForward} 
          onClick={() => console.log('Next track')}
        />
      </div>

      {/* Volume Control */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-10">{volume[0]}%</span>
        </div>
      </div>

      {/* Quick Audio Sources */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Bluetooth Audio', active: true },
          { name: 'Local Files', active: false },
          { name: 'Streaming', active: false },
          { name: 'Radio', active: false }
        ].map((source, index) => (
          <Button
            key={index}
            variant={source.active ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            {source.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AudioCenter;
