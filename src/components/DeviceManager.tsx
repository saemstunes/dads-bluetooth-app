
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Bluetooth, Volume2, ArrowUp } from 'lucide-react';

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  signal: number;
}

interface DeviceManagerProps {
  devices: Device[];
  onDeviceUpdate: (devices: Device[]) => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ devices, onDeviceUpdate }) => {
  const [scanning, setScanning] = useState(false);

  const toggleDeviceConnection = (deviceId: number) => {
    const updatedDevices = devices.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          status: device.status === 'connected' ? 'disconnected' : 'connected',
          signal: device.status === 'connected' ? 0 : Math.floor(Math.random() * 40) + 60
        };
      }
      return device;
    });
    onDeviceUpdate(updatedDevices);
  };

  const scanForDevices = () => {
    setScanning(true);
    setTimeout(() => {
      const newDevice = {
        id: devices.length + 1,
        name: 'AirPods Pro',
        type: 'bluetooth',
        status: 'discovered',
        signal: 78
      };
      onDeviceUpdate([...devices, newDevice]);
      setScanning(false);
    }, 3000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'bluetooth':
        return <Bluetooth className="h-5 w-5" />;
      case 'wifi':
        return <ArrowUp className="h-5 w-5" />;
      default:
        return <Volume2 className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'discovered':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Device Manager</h2>
          <p className="text-muted-foreground">Manage Bluetooth and WiFi-Direct connections</p>
        </div>
        <Button 
          onClick={scanForDevices}
          disabled={scanning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {scanning ? 'Scanning...' : 'Scan for Devices'}
        </Button>
      </div>

      {/* Device Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Connected Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.filter(d => d.status === 'connected').map(device => (
              <div key={device.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={device.status === 'connected'}
                    onCheckedChange={() => toggleDeviceConnection(device.id)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Signal Strength</span>
                    <span>{device.signal}%</span>
                  </div>
                  <Progress value={device.signal} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Settings</Button>
                  <Button size="sm" variant="outline">Audio Test</Button>
                </div>
              </div>
            ))}
            {devices.filter(d => d.status === 'connected').length === 0 && (
              <p className="text-center text-muted-foreground py-8">No connected devices</p>
            )}
          </CardContent>
        </Card>

        {/* Available Devices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              Available Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.filter(d => d.status !== 'connected').map(device => (
              <div key={device.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === 'discovered' ? 'default' : 'secondary'}>
                    {device.status}
                  </Badge>
                </div>
                {device.status === 'discovered' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Signal Strength</span>
                      <span>{device.signal}%</span>
                    </div>
                    <Progress value={device.signal} className="h-2" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => toggleDeviceConnection(device.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Connect
                  </Button>
                  {device.status === 'discovered' && (
                    <Button size="sm" variant="outline">Pair</Button>
                  )}
                </div>
              </div>
            ))}
            {devices.filter(d => d.status !== 'connected').length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {scanning ? 'Scanning for devices...' : 'No available devices'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auto-Connect Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Connect Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Auto-connect to car audio</p>
                <p className="text-sm text-muted-foreground">When in range</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Auto-connect to home speakers</p>
                <p className="text-sm text-muted-foreground">When at home location</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Smart switching</p>
                <p className="text-sm text-muted-foreground">Switch to best available device</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Background scanning</p>
                <p className="text-sm text-muted-foreground">Continuously scan for devices</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManager;
