
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '@/contexts/AudioContext';
import { 
  Bluetooth, 
  Signal, 
  Battery,
  Headphones,
  Car,
  Smartphone,
  Speaker,
  Scan,
  Watch,
  Gamepad2
} from 'lucide-react';

interface BluetoothDevice {
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

const BluetoothManager: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([
    {
      id: '1',
      name: 'Samsung Galaxy Buds Pro',
      type: 'audio',
      category: 'earphones',
      connected: true,
      paired: true,
      battery: 85,
      signalStrength: 95,
      lastConnected: new Date(),
      audioProfile: 'A2DP'
    },
    {
      id: '2', 
      name: 'BMW Car Audio',
      type: 'car',
      category: 'car',
      connected: false,
      paired: true,
      signalStrength: 0,
      lastConnected: new Date(Date.now() - 3600000),
      audioProfile: 'A2DP'
    },
    {
      id: '3',
      name: 'iPhone 15 Pro',
      type: 'phone',
      category: 'phone',
      connected: false,
      paired: true,
      signalStrength: 0,
      audioProfile: 'HFP'
    }
  ]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<BluetoothDevice[]>([]);
  const [deviceCategories] = useState([
    { name: 'Headphones', icon: Headphones, type: 'headphones' },
    { name: 'Earphones', icon: Headphones, type: 'earphones' },
    { name: 'Mobile Phones', icon: Smartphone, type: 'phone' },
    { name: 'Smart Watches', icon: Watch, type: 'smartwatch' },
    { name: 'Car Audio', icon: Car, type: 'car' },
    { name: 'Speakers', icon: Speaker, type: 'speaker' },
    { name: 'Gaming Controllers', icon: Gamepad2, type: 'gamepad' }
  ]);
  
  const { toast } = useToast();
  const { connectBluetoothDevice } = useAudio();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'audio': return Headphones;
      case 'car': return Car;
      case 'phone': return Smartphone;
      case 'speaker': return Speaker;
      case 'watch': return Watch;
      case 'gamepad': return Gamepad2;
      default: return Bluetooth;
    }
  };

  const getDeviceColor = (type: string, connected: boolean) => {
    const colors = {
      audio: connected ? 'text-green-400' : 'text-green-600',
      car: connected ? 'text-blue-400' : 'text-blue-600',
      phone: connected ? 'text-purple-400' : 'text-purple-600',
      speaker: connected ? 'text-orange-400' : 'text-orange-600',
      watch: connected ? 'text-pink-400' : 'text-pink-600',
      gamepad: connected ? 'text-yellow-400' : 'text-yellow-600'
    };
    return colors[type] || 'text-gray-400';
  };

  const startScan = async () => {
    setIsScanning(true);
    
    try {
      // Check if Web Bluetooth API is available
      if ('bluetooth' in navigator && (navigator.bluetooth as any)) {
        const bluetoothNav = navigator.bluetooth as any;
        const device = await bluetoothNav.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'device_information']
        });
        
        console.log('Found device:', device.name);
        
        // Add to nearby devices
        const newDevice: BluetoothDevice = {
          id: device.id || Math.random().toString(),
          name: device.name || 'Unknown Device',
          type: 'audio',
          category: 'other',
          connected: false,
          paired: false,
          signalStrength: 80,
          audioProfile: 'A2DP'
        };
        
        setNearbyDevices(prev => [...prev, newDevice]);
      } else {
        // Simulate scanning for demo with various device categories
        setTimeout(() => {
          const simulatedDevices: BluetoothDevice[] = [
            {
              id: '4',
              name: 'AirPods Pro',
              type: 'audio',
              category: 'earphones',
              connected: false,
              paired: false,
              signalStrength: 75,
              audioProfile: 'A2DP'
            },
            {
              id: '5',
              name: 'Apple Watch Series 9',
              type: 'watch',
              category: 'smartwatch',
              connected: false,
              paired: false,
              signalStrength: 85,
              battery: 67
            },
            {
              id: '6',
              name: 'Tesla Model S',
              type: 'car',
              category: 'car',
              connected: false,
              paired: false,
              signalStrength: 65,
              audioProfile: 'A2DP'
            }
          ];
          setNearbyDevices(simulatedDevices);
        }, 2000);
      }
    } catch (error) {
      console.error('Bluetooth scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Could not scan for devices. Please check permissions.",
        variant: "destructive",
        className: `${isDarkMode ? 'bg-red-900/80 border-red-700 text-red-200' : 'bg-red-50 border-red-300 text-red-800'} backdrop-blur-md`
      });
    } finally {
      setTimeout(() => setIsScanning(false), 3000);
    }
  };

  const connectDevice = async (device: BluetoothDevice) => {
    try {
      setDevices(prev => prev.map(d => 
        d.id === device.id 
          ? { ...d, connected: true, paired: true, lastConnected: new Date() }
          : d
      ));

      if (device.type === 'audio' || device.type === 'car') {
        connectBluetoothDevice(device.name);
      }

      toast({
        title: "Connected Successfully",
        description: `Connected to ${device.name}`,
        className: `${isDarkMode ? 'bg-green-900/80 border-green-700 text-green-200' : 'bg-green-50 border-green-300 text-green-800'} backdrop-blur-md`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to device",
        variant: "destructive"
      });
    }
  };

  const disconnectDevice = (device: BluetoothDevice) => {
    setDevices(prev => prev.map(d => 
      d.id === device.id ? { ...d, connected: false } : d
    ));

    toast({
      title: "Disconnected",
      description: `Disconnected from ${device.name}`,
      className: `${isDarkMode ? 'bg-yellow-900/80 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-300 text-yellow-800'} backdrop-blur-md`
    });
  };

  // Auto-connect to trusted devices when in range
  useEffect(() => {
    const interval = setInterval(() => {
      devices.forEach(device => {
        if (device.paired && !device.connected && device.type === 'car') {
          // Simulate car proximity detection
          const inRange = Math.random() > 0.8;
          if (inRange) {
            connectDevice(device);
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [devices]);

  const DeviceCard = ({ device }: { device: BluetoothDevice }) => {
    const Icon = getDeviceIcon(device.type);
    
    return (
      <Card className={`p-6 transition-all duration-500 hover:scale-105 transform ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
          : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
      } backdrop-blur-md rounded-3xl shadow-lg hover:shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${
              device.connected 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-gray-500/20 border border-gray-500/30'
            }`}>
              <Icon className={`h-6 w-6 ${getDeviceColor(device.type, device.connected)}`} />
            </div>
            <div>
              <h4 className={`font-bold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {device.name}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {device.category}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                {device.battery && (
                  <div className="flex items-center space-x-1">
                    <Battery className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-green-400">{device.battery}%</span>
                  </div>
                )}
                {device.connected && (
                  <div className="flex items-center space-x-1">
                    <Signal className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-400">{device.signalStrength}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            size="lg"
            onClick={() => device.connected ? disconnectDevice(device) : connectDevice(device)}
            className={`rounded-full text-lg px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${
              device.connected
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
            }`}
          >
            {device.connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-base px-4 py-2 ${
            device.connected
              ? 'text-green-400 border-green-400/50'
              : device.paired
                ? 'text-blue-400 border-blue-400/50'
                : 'text-gray-400 border-gray-400/50'
          }`}>
            {device.connected ? 'Connected' : device.paired ? 'Paired' : 'Available'}
          </Badge>
          
          {device.audioProfile && device.connected && (
            <span className={`text-lg ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
              {device.audioProfile}
            </span>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className={`text-2xl font-bold flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Bluetooth className="h-6 w-6 mr-3 text-blue-400" />
          Bluetooth Manager
        </h3>
        
        <Button
          size="lg"
          onClick={startScan}
          disabled={isScanning}
          className={`rounded-full text-lg px-6 py-3 transition-all duration-300 hover:scale-105 ${
            isScanning 
              ? 'bg-blue-500/30 cursor-not-allowed' 
              : 'bg-blue-500/20 hover:bg-blue-500/30'
          } text-blue-400 border border-blue-500/30`}
        >
          {isScanning ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400" />
          ) : (
            <Scan className="h-5 w-5" />
          )}
          <span className="ml-3">{isScanning ? 'Scanning...' : 'Scan'}</span>
        </Button>
      </div>

      {/* Device Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {deviceCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card key={index} className={`p-4 text-center transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl cursor-pointer`}>
              <Icon className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`} />
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {category.name}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {devices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>

      {nearbyDevices.length > 0 && (
        <div>
          <h4 className={`text-xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Nearby Devices
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {nearbyDevices.map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BluetoothManager;
