
import { WebPlugin } from '@capacitor/core';
import type { BluetoothManagerPlugin, BluetoothDevice } from './NativeBluetoothManager';

export class BluetoothManagerWeb extends WebPlugin implements BluetoothManagerPlugin {
  private bluetoothDevice: BluetoothDevice | null = null;
  private connectedDevices: BluetoothDevice[] = [];

  async scanForDevices(options?: { timeout?: number }): Promise<{ devices: BluetoothDevice[] }> {
    try {
      if ('bluetooth' in navigator) {
        const device = await (navigator.bluetooth as any).requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'device_information', 'generic_access']
        });

        const bluetoothDevice: BluetoothDevice = {
          id: device.id || Math.random().toString(),
          name: device.name || 'Unknown Device',
          address: device.id || 'unknown',
          type: this.detectDeviceType(device.name || ''),
          category: this.detectDeviceCategory(device.name || ''),
          connected: false,
          paired: false,
          signalStrength: 85,
          audioProfile: 'A2DP'
        };

        return { devices: [bluetoothDevice] };
      } else {
        // Simulate realistic car audio devices for demo
        const simulatedDevices: BluetoothDevice[] = [
          {
            id: 'mazda-cx5-audio',
            name: 'MAZDA CX-5',
            address: '00:1A:7D:DA:71:13',
            type: 'car',
            category: 'car',
            connected: false,
            paired: false,
            signalStrength: 90,
            audioProfile: 'A2DP'
          },
          {
            id: 'car-hands-free',
            name: 'Car Hands-Free',
            address: '00:1A:7D:DA:71:14',
            type: 'car',
            category: 'car',
            connected: false,
            paired: false,
            signalStrength: 85,
            audioProfile: 'HFP'
          }
        ];
        return { devices: simulatedDevices };
      }
    } catch (error) {
      console.error('Bluetooth scan error:', error);
      return { devices: [] };
    }
  }

  async connectToDevice(options: { deviceId: string }): Promise<{ success: boolean }> {
    try {
      const device = this.connectedDevices.find(d => d.id === options.deviceId);
      if (device) {
        device.connected = true;
        this.notifyListeners('deviceConnected', { device });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Connection error:', error);
      return { success: false };
    }
  }

  async disconnectFromDevice(options: { deviceId: string }): Promise<{ success: boolean }> {
    try {
      const device = this.connectedDevices.find(d => d.id === options.deviceId);
      if (device) {
        device.connected = false;
        this.notifyListeners('deviceDisconnected', { device });
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async getPairedDevices(): Promise<{ devices: BluetoothDevice[] }> {
    return { devices: this.connectedDevices.filter(d => d.paired) };
  }

  async getConnectedDevices(): Promise<{ devices: BluetoothDevice[] }> {
    return { devices: this.connectedDevices.filter(d => d.connected) };
  }

  async isBluetoothEnabled(): Promise<{ enabled: boolean }> {
    return { enabled: 'bluetooth' in navigator };
  }

  async enableBluetooth(): Promise<{ success: boolean }> {
    return { success: true };
  }

  async sendAudioToDevice(options: { deviceId: string; audioData: string }): Promise<{ success: boolean }> {
    console.log('Sending audio to device:', options.deviceId);
    this.notifyListeners('audioStateChanged', { deviceId: options.deviceId, playing: true });
    return { success: true };
  }

  private detectDeviceType(name: string): BluetoothDevice['type'] {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('car') || lowerName.includes('mazda') || lowerName.includes('toyota') || lowerName.includes('honda')) return 'car';
    if (lowerName.includes('headphone') || lowerName.includes('buds') || lowerName.includes('airpods')) return 'audio';
    if (lowerName.includes('speaker')) return 'speaker';
    if (lowerName.includes('phone') || lowerName.includes('iphone') || lowerName.includes('samsung')) return 'phone';
    if (lowerName.includes('watch')) return 'watch';
    if (lowerName.includes('controller') || lowerName.includes('gamepad')) return 'gamepad';
    return 'unknown';
  }

  private detectDeviceCategory(name: string): BluetoothDevice['category'] {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('car') || lowerName.includes('mazda') || lowerName.includes('auto')) return 'car';
    if (lowerName.includes('headphone')) return 'headphones';
    if (lowerName.includes('buds') || lowerName.includes('airpods')) return 'earphones';
    if (lowerName.includes('watch')) return 'smartwatch';
    if (lowerName.includes('phone')) return 'phone';
    if (lowerName.includes('speaker')) return 'speaker';
    if (lowerName.includes('controller')) return 'gamepad';
    return 'other';
  }
}
