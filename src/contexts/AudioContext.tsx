
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  coverArt?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  playlist: Track[];
  currentIndex: number;
  isShuffled: boolean;
  isRepeating: boolean;
  connectedDevice: string | null;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  loadPlaylist: (tracks: Track[]) => void;
  playTrack: (index: number) => void;
  connectBluetoothDevice: (deviceName: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(75);
  const [progress, setProgressState] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([
    {
      id: '1',
      title: 'Midnight Drive',
      artist: 'Synthetic Dreams',
      album: 'Neon Nights',
      duration: 245,
      coverArt: '/api/placeholder/300/300'
    },
    {
      id: '2',
      title: 'Digital Horizon',
      artist: 'Electric Pulse',
      album: 'Future Waves',
      duration: 312,
      coverArt: '/api/placeholder/300/300'
    },
    {
      id: '3',
      title: 'Chrome Reflection',
      artist: 'Meta Sound',
      album: 'Glass World',
      duration: 287,
      coverArt: '/api/placeholder/300/300'
    }
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (playlist.length > 0 && !currentTrack) {
      setCurrentTrack(playlist[0]);
    }
  }, [playlist, currentTrack]);

  useEffect(() => {
    // Simulate Bluetooth device connection
    if ('bluetooth' in navigator) {
      // Web Bluetooth API available
      console.log('Bluetooth API available');
    }
  }, []);

  const play = () => {
    setIsPlaying(true);
    if (connectedDevice) {
      toast({
        title: "Playing on " + connectedDevice,
        description: currentTrack ? `${currentTrack.title} - ${currentTrack.artist}` : "Audio",
        className: "bg-green-900/80 border-green-700 text-green-200 backdrop-blur-md"
      });
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const next = () => {
    const nextIndex = isShuffled 
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
  };

  const previous = () => {
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const setProgress = (newProgress: number) => {
    setProgressState(newProgress);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const loadPlaylist = (tracks: Track[]) => {
    setPlaylist(tracks);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setCurrentIndex(0);
    }
  };

  const playTrack = (index: number) => {
    setCurrentIndex(index);
    setCurrentTrack(playlist[index]);
    setIsPlaying(true);
  };

  const connectBluetoothDevice = async (deviceName: string) => {
    try {
      // Simulate Bluetooth connection
      setConnectedDevice(deviceName);
      toast({
        title: "Connected to " + deviceName,
        description: "Audio routing established",
        className: "bg-blue-900/80 border-blue-700 text-blue-200 backdrop-blur-md"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to " + deviceName,
        variant: "destructive"
      });
    }
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      progress,
      playlist,
      currentIndex,
      isShuffled,
      isRepeating,
      connectedDevice,
      play,
      pause,
      next,
      previous,
      setVolume,
      setProgress,
      toggleShuffle,
      toggleRepeat,
      loadPlaylist,
      playTrack,
      connectBluetoothDevice
    }}>
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
};
