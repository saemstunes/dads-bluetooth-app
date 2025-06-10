import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Music } from 'lucide-react';

interface ElasticSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({ 
  value, 
  onChange, 
  max = 100, 
  className = "" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(Math.round(value));

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onChange(localValue);
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round(percentage * max);
    setLocalValue(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(Math.round(value));
    }
  }, [value, isDragging]);

  return (
    <div className={`relative w-full h-3 ${className}`}>
      <div 
        className="w-full h-3 bg-white/10 rounded-full cursor-pointer transition-all duration-300 hover:bg-white/20"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 relative overflow-hidden"
          style={{ width: `${(localValue / max) * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
        <div 
          className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-300 hover:scale-110"
          style={{ left: `calc(${(localValue / max) * 100}% - 10px)` }}
        />
      </div>
    </div>
  );
};

const BlurText: React.FC<{ children: string; isVisible: boolean }> = ({ children, isVisible }) => {
  return (
    <span 
      className={`transition-all duration-500 ${
        isVisible ? 'blur-none opacity-100' : 'blur-sm opacity-70'
      }`}
    >
      {children}
    </span>
  );
};

const GlareHover: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

const ClickSpark: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ 
  children, 
  onClick 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick?.();
  };

  return (
    <div 
      className="relative overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {children}
      {isClicked && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
};

const MiniPlayer: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { currentTrack, isPlaying, play, pause, next, previous } = useAudio();

  if (!currentTrack || !isPlaying) return null;

  return (
    <Card className={`fixed bottom-20 left-4 right-4 p-4 transition-all duration-500 z-40 ${
      isDarkMode 
        ? 'bg-black/90 border-white/20' 
        : 'bg-white/90 border-gray-300'
    } backdrop-blur-md rounded-2xl shadow-2xl`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentTrack.title}
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentTrack.artist}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={previous}
            className="rounded-full w-10 h-10 p-0"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={isPlaying ? pause : play}
            className="rounded-full w-12 h-12 p-0"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            size="sm"
            onClick={next}
            className="rounded-full w-10 h-10 p-0"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const EnhancedAudioPlayer: React.FC<{ isDarkMode: boolean; compact?: boolean }> = ({ 
  isDarkMode, 
  compact = false 
}) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    isShuffled,
    isRepeating,
    connectedDevice,
    play,
    pause,
    next,
    previous,
    setVolume,
    toggleShuffle,
    toggleRepeat
  } = useAudio();

  const CircularButton = ({ 
    icon: Icon, 
    onClick, 
    active = false, 
    size = 'md',
    label 
  }: {
    icon: any;
    onClick: () => void;
    active?: boolean;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }) => {
    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-20 h-20', 
      lg: 'w-24 h-24'
    };

    return (
      <div className="flex flex-col items-center space-y-3">
        <ClickSpark onClick={onClick}>
          <GlareHover>
            <Button
              className={`
                ${sizeClasses[size]} rounded-full p-0 border-2 transition-all duration-300 
                hover:scale-110 transform shadow-2xl hover:shadow-3xl backdrop-blur-md
                ${active 
                  ? `${isDarkMode 
                      ? 'bg-purple-500/30 border-purple-400/60 shadow-purple-500/40' 
                      : 'bg-purple-200 border-purple-400 shadow-purple-300/60'
                    }` 
                  : `${isDarkMode 
                      ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                      : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                    }`
                }
              `}
            >
              <Icon className={`h-8 w-8 ${active 
                ? (isDarkMode ? 'text-white' : 'text-purple-700') 
                : (isDarkMode ? 'text-white/80' : 'text-black/70')
              }`} />
            </Button>
          </GlareHover>
        </ClickSpark>
        {label && (
          <span className={`text-lg font-bold ${
            isDarkMode ? 'text-white/80' : 'text-black/70'
          }`}>
            <BlurText isVisible={!!currentTrack}>{label}</BlurText>
          </span>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <>
        <Card className={`p-8 border transition-all duration-500 backdrop-blur-md ${
          isDarkMode 
            ? 'bg-white/5 border-white/10 hover:bg-white/8' 
            : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
        } rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-102`}>
          <div className="space-y-8">
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <BlurText isVisible={!!currentTrack}>Now Playing</BlurText>
              </h3>
              {connectedDevice && (
                <p className={`text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  ♪ {connectedDevice}
                </p>
              )}
            </div>

            {currentTrack && (
              <GlareHover className={`p-6 rounded-3xl ${
                isDarkMode ? 'bg-white/5' : 'bg-gray-50/80'
              }`}>
                <div className="text-center space-y-4">
                  <h4 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <BlurText isVisible={isPlaying}>{currentTrack.title}</BlurText>
                  </h4>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    <BlurText isVisible={isPlaying}>{currentTrack.artist}</BlurText>
                  </p>
                  
                  <div className="mt-6">
                    <ElasticSlider
                      value={(progress / currentTrack.duration) * 100}
                      onChange={(value) => {}}
                      className="mb-3"
                    />
                    <div className={`flex justify-between text-lg ${
                      isDarkMode ? 'text-white/50' : 'text-gray-500'
                    }`}>
                      <span>{Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}</span>
                      <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </GlareHover>
            )}

            <div className="flex items-center justify-center space-x-8">
              <CircularButton 
                icon={SkipBack} 
                onClick={previous}
                size="sm"
              />
              <CircularButton 
                icon={isPlaying ? Pause : Play} 
                onClick={isPlaying ? pause : play}
                active={isPlaying}
                size="lg"
              />
              <CircularButton 
                icon={SkipForward} 
                onClick={next}
                size="sm"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Volume2 className={`h-6 w-6 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`} />
                <ElasticSlider
                  value={volume}
                  onChange={setVolume}
                  className="flex-1"
                />
                <span className={`text-lg font-bold min-w-12 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                  {Math.round(volume)}%
                </span>
              </div>

              <div className="flex items-center justify-center space-x-8">
                <CircularButton 
                  icon={Shuffle} 
                  onClick={toggleShuffle}
                  active={isShuffled}
                  size="sm"
                  label="Shuffle"
                />
                <CircularButton 
                  icon={Repeat} 
                  onClick={toggleRepeat}
                  active={isRepeating}
                  size="sm"
                  label="Repeat"
                />
              </div>
            </div>
          </div>
        </Card>
        <MiniPlayer isDarkMode={isDarkMode} />
      </>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className={`text-2xl font-bold flex items-center ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <Music className="h-6 w-6 mr-3 text-purple-400" />
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
            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{Math.floor(progress / 60)}:{(progress % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Circular Audio Controls */}
      <div className="flex items-center justify-center space-x-6">
        <CircularButton 
          icon={SkipBack} 
          onClick={previous}
        />
        <CircularButton 
          icon={isPlaying ? Pause : Play} 
          onClick={isPlaying ? pause : play}
          active={isPlaying}
          size="lg"
        />
        <CircularButton 
          icon={SkipForward} 
          onClick={next}
        />
      </div>

      {/* Volume Control */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <ElasticSlider
            value={volume}
            onChange={setVolume}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-sm text-gray-400 w-10">{volume}%</span>
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

import { Music } from 'lucide-react';
export default EnhancedAudioPlayer;

}
