
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bluetooth, 
  Wifi, 
  Car, 
  Headphones, 
  Smartphone, 
  Signal, 
  Battery,
  Plus,
  Settings
} from 'lucide-react';

interface Device {
  id: string;
  device_name: string;
  device_type: string;
  is_trusted: boolean;
  signal_strength?: number;
  battery_level?: number;
  last_connected_at?: string;
  connection_count?: number;
}

interface DeviceManagerProps {
  connectedDevices: Device[];
  isDarkMode: boolean;
  compact?: boolean;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ 
  connectedDevices, 
  isDarkMode, 
  compact = false 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'bluetooth':
        return Headphones;
      case 'wifi_direct':
        return Wifi;
      case 'aux':
        return Car;
      default:
        return Smartphone;
    }
  };

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType) {
      case 'bluetooth':
        return 'blue';
      case 'wifi_direct':
        return 'green';
      case 'aux':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleDeviceConnection = async (device: Device) => {
    try {
      const { error } = await supabase
        .from('device_connections')
        .update({ 
          last_connected_at: new Date().toISOString(),
          connection_count: (device.connection_count || 0) + 1 
        })
        .eq('id', device.id);

      if (error) throw error;

      toast({
        title: "Device Connected",
        description: `Successfully connected to ${device.device_name}`,
        className: `${isDarkMode ? 'bg-green-900/80 border-green-700 text-green-200' : 'bg-green-50 border-green-300 text-green-800'} backdrop-blur-md`
      });

    } catch (error) {
      console.error('Error connecting device:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to device",
        variant: "destructive",
        className: `${isDarkMode ? 'bg-red-900/80 border-red-700 text-red-200' : 'bg-red-50 border-red-300 text-red-800'} backdrop-blur-md`
      });
    }
  };

  const startDeviceScan = async () => {
    setIsScanning(true);
    
    // Simulate device scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "Found 2 new devices nearby",
        className: `${isDarkMode ? 'bg-blue-900/80 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-800'} backdrop-blur-md`
      });
    }, 3000);
  };

  const CircularDeviceButton = ({ device }: { device: Device }) => {
    const Icon = getDeviceIcon(device.device_type);
    const color = getDeviceColor(device.device_type);
    
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={() => handleDeviceConnection(device)}
          className={`
            w-14 h-14 rounded-full p-0 border-2 transition-all duration-300 hover:scale-105 transform hover:shadow-lg
            ${device.is_trusted 
              ? `${isDarkMode 
                  ? `bg-${color}-500/20 border-${color}-400/50 shadow-${color}-500/30 hover:bg-${color}-500/30` 
                  : `bg-${color}-100 border-${color}-400 shadow-${color}-300/50 hover:bg-${color}-200`
                }` 
              : `${isDarkMode 
                  ? `bg-${color}-500/10 border-${color}-500/30 hover:bg-${color}-500/20 hover:border-${color}-400/50`
                  : `bg-${color}-50 border-${color}-300 hover:bg-${color}-100 hover:border-${color}-400`
                }`
            }
          `}
        >
          <Icon className={`h-5 w-5 ${device.is_trusted 
            ? (isDarkMode ? 'text-white' : `text-${color}-700`) 
            : (isDarkMode ? `text-${color}-400` : `text-${color}-600`)
          }`} />
        </Button>
        
        <div className="text-center">
          <p className={`text-xs font-medium max-w-16 leading-tight truncate ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {device.device_name}
          </p>
          {device.battery_level && (
            <div className="flex items-center justify-center space-x-1 mt-1">
              <Battery className={`h-3 w-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {device.battery_level}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold flex items-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Bluetooth className="h-4 w-4 mr-2 text-blue-400" />
            Devices
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={startDeviceScan}
            disabled={isScanning}
            className={`rounded-full transition-all duration-300 hover:scale-105 transform ${
              isDarkMode 
                ? 'border-white/20 hover:bg-white/10 hover:border-white/30' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isScanning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {connectedDevices.slice(0, 3).map(device => (
            <CircularDeviceButton key={device.id} device={device} />
          ))}
        </div>

        <div className="mt-4 text-center">
          <Badge variant="outline" className={`text-xs ${
            isDarkMode 
              ? 'border-white/20 text-gray-300' 
              : 'border-gray-300 text-gray-600'
          }`}>
            {connectedDevices.filter(d => d.is_trusted).length} Connected
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold flex items-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Bluetooth className="h-5 w-5 mr-2 text-blue-400" />
          Device Manager
        </h3>
        <div className="flex space-x-2">
          <Button
            onClick={startDeviceScan}
            disabled={isScanning}
            className="rounded-full transition-all duration-300 hover:scale-105 transform"
          >
            {isScanning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="ml-2">{isScanning ? 'Scanning...' : 'Scan'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`rounded-full transition-all duration-300 hover:scale-105 transform ${
              isDarkMode 
                ? 'border-white/20 hover:bg-white/10' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
        {connectedDevices.map(device => (
          <CircularDeviceButton key={device.id} device={device} />
        ))}
      </div>

      {/* Device Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 transform ${
          isDarkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'
        }`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Trusted
          </p>
          <p className="text-lg font-bold text-green-400">
            {connectedDevices.filter(d => d.is_trusted).length}
          </p>
        </div>
        <div className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 transform ${
          isDarkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'
        }`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Available
          </p>
          <p className="text-lg font-bold text-blue-400">
            {connectedDevices.length}
          </p>
        </div>
        <div className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 transform ${
          isDarkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-gray-50 hover:bg-gray-100'
        }`}>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Active
          </p>
          <p className="text-lg font-bold text-purple-400">
            {connectedDevices.filter(d => 
              d.last_connected_at && 
              new Date(d.last_connected_at) > new Date(Date.now() - 86400000)
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeviceManager;
