
import { registerPlugin } from '@capacitor/core';

export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  type: 'audio' | 'car' | 'phone' | 'speaker' | 'watch' | 'gamepad' | 'unknown';
  connected: boolean;
  paired: boolean;
  battery?: number;
  signalStrength: number;
  audioProfile?: 'A2DP' | 'HFP' | 'AVRCP';
  category: 'headphones' | 'earphones' | 'smartwatch' | 'phone' | 'car' | 'speaker' | 'gamepad' | 'other';
}

export interface BluetoothManagerPlugin {
  scanForDevices(options?: { timeout?: number }): Promise<{ devices: BluetoothDevice[] }>;
  connectToDevice(options: { deviceId: string }): Promise<{ success: boolean }>;
  disconnectFromDevice(options: { deviceId: string }): Promise<{ success: boolean }>;
  getPairedDevices(): Promise<{ devices: BluetoothDevice[] }>;
  getConnectedDevices(): Promise<{ devices: BluetoothDevice[] }>;
  isBluetoothEnabled(): Promise<{ enabled: boolean }>;
  enableBluetooth(): Promise<{ success: boolean }>;
  sendAudioToDevice(options: { deviceId: string; audioData: string }): Promise<{ success: boolean }>;
  addListener(eventName: 'deviceConnected' | 'deviceDisconnected' | 'audioStateChanged', listenerFunc: (event: any) => void): Promise<any>;
}

const BluetoothManager = registerPlugin<BluetoothManagerPlugin>('BluetoothManager', {
  web: () => import('./BluetoothManagerWeb').then(m => new m.BluetoothManagerWeb()),
});

export default BluetoothManager;
