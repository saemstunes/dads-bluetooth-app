
import { useState, useEffect, useCallback } from 'react';
import BluetoothService from '../services/BluetoothService';
import MediaSessionService from '../services/MediaSessionService';

export interface BluetoothDevice {
  id: string;
  name: string;
  type: 'audio' | 'car' | 'phone' | 'speaker' | 'watch' | 'gamepad' | 'unknown';
  connected: boolean;
  paired: boolean;
  battery?: number;
  signalStrength: number;
  lastConnected?: Date;
  audioProfile?: 'A2DP' | 'HFP' | 'AVRCP';
  category: 'headphones' | 'earphones' | 'smartwatch' | 'phone' | 'car' | 'speaker' | 'gamepad' | 'other';
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  artwork?: string;
}

export const useBluetoothA2DP = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);

  const bluetoothService = BluetoothService.getInstance();
  const mediaSessionService = MediaSessionService.getInstance();

  // Initialize permissions
  useEffect(() => {
    const initPermissions = async () => {
      const granted = await bluetoothService.requestPermissions();
      setHasPermissions(granted);
    };
    initPermissions();
  }, []);

  // Scan for devices
  const scanForDevices = useCallback(async () => {
    if (!hasPermissions) {
      console.warn('Bluetooth permissions not granted');
      return;
    }

    setIsScanning(true);
    try {
      const foundDevices = await bluetoothService.scanDevices();
      setDevices(prev => {
        const existingIds = prev.map(d => d.id);
        const newDevices = foundDevices.filter(d => !existingIds.includes(d.id));
        return [...prev, ...newDevices];
      });
    } catch (error) {
      console.error('Failed to scan for devices:', error);
    } finally {
      setIsScanning(false);
    }
  }, [hasPermissions]);

  // Connect to device
  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    try {
      const success = await bluetoothService.connectDevice(device.id);
      if (success) {
        setConnectedDevice(device);
        setDevices(prev => prev.map(d => 
          d.id === device.id ? { ...d, connected: true } : { ...d, connected: false }
        ));
      }
      return success;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }, []);

  // Disconnect from device
  const disconnectFromDevice = useCallback(async (deviceId: string) => {
    try {
      const success = await bluetoothService.disconnectDevice(deviceId);
      if (success) {
        setConnectedDevice(null);
        setDevices(prev => prev.map(d => 
          d.id === deviceId ? { ...d, connected: false } : d
        ));
      }
      return success;
    } catch (error) {
      console.error('Failed to disconnect from device:', error);
      return false;
    }
  }, []);

  // Update track metadata
  const updateTrackMetadata = useCallback((track: AudioTrack) => {
    setCurrentTrack(track);
    mediaSessionService.updateMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album || '',
      artwork: track.artwork || ''
    });
  }, []);

  // Playback controls
  const play = useCallback(() => {
    setIsPlaying(true);
    mediaSessionService.updatePlaybackState('playing');
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    mediaSessionService.updatePlaybackState('paused');
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    mediaSessionService.updatePlaybackState('stopped');
  }, []);

  const next = useCallback(() => {
    // Emit next track event
    console.log('Next track requested');
  }, []);

  const previous = useCallback(() => {
    // Emit previous track event
    console.log('Previous track requested');
  }, []);

  return {
    devices,
    connectedDevice,
    isScanning,
    currentTrack,
    isPlaying,
    hasPermissions,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    updateTrackMetadata,
    play,
    pause,
    stop,
    next,
    previous
  };
};
