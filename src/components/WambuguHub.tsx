
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Dock from './Dock';
import JarvisVoiceAssistant from './JarvisVoiceAssistant';
import EnhancedAudioPlayer from './EnhancedAudioPlayer';
import DeviceManager from './DeviceManager';
import AutomationBuilder from './AutomationBuilder';
import Settings from './Settings';
import StatusIndicators from './StatusIndicators';
import BluetoothManager from '../utils/NativeBluetoothManager';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  Car, 
  Smartphone, 
  Moon, 
  Sun, 
  Settings as SettingsIcon, 
  Home, 
  Music,
  Bluetooth,
  Wifi,
  Volume2,
  Archive,
  Zap
} from 'lucide-react';

type ViewType = 'main' | 'automation' | 'settings' | 'audio';

const WambuguHub = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('main');
  const [isCarMode, setIsCarMode] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const { toast } = useToast();

  // Enhanced device queries with real Bluetooth integration
  const { data: devices = [] } = useQuery({
    queryKey: ['connected-devices'],
    queryFn: async () => {
      try {
        // Try to get real Bluetooth devices first
        const bluetoothDevices = await BluetoothManager.getConnectedDevices();
        if (bluetoothDevices.devices.length > 0) {
          return bluetoothDevices.devices.map(device => ({
            id: device.id,
            device_name: device.name,
            device_type: device.type,
            is_trusted: device.paired,
            signal_strength: device.signalStrength,
            battery_level: device.battery,
            last_connected_at: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.log('Bluetooth not available, using database fallback');
      }

      // Fallback to database
      const { data, error } = await supabase
        .from('device_connections')
        .select('*')
        .eq('is_trusted', true);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 5000,
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('enabled', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    setConnectedDevices(devices);
  }, [devices]);

  useEffect(() => {
    setAutomationRules(rules);
  }, [rules]);

  // Initialize Bluetooth
  useEffect(() => {
    const initializeBluetooth = async () => {
      try {
        const status = await BluetoothManager.isBluetoothEnabled();
        setBluetoothEnabled(status.enabled);

        // Listen for Bluetooth events
        BluetoothManager.addListener('deviceConnected', (event) => {
          toast({
            title: "Device Connected",
            description: `${event.device.name} is now connected`,
            className: `${isDarkMode ? 'bg-green-900/80 border-green-700 text-green-200' : 'bg-green-50 border-green-300 text-green-800'} backdrop-blur-md`
          });
        });

        BluetoothManager.addListener('deviceDisconnected', (event) => {
          toast({
            title: "Device Disconnected",
            description: `${event.device.name} has been disconnected`,
            className: `${isDarkMode ? 'bg-yellow-900/80 border-yellow-700 text-yellow-200' : 'bg-yellow-50 border-yellow-300 text-yellow-800'} backdrop-blur-md`
          });
        });

      } catch (error) {
        console.error('Bluetooth initialization error:', error);
      }
    };

    initializeBluetooth();
  }, [isDarkMode, toast]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleCarMode = async () => {
    setIsCarMode(!isCarMode);
    
    if (!isCarMode) {
      // Entering car mode - scan for car audio systems
      try {
        const scanResult = await BluetoothManager.scanForDevices({ timeout: 10000 });
        const carDevices = scanResult.devices.filter(device => device.type === 'car');
        
        if (carDevices.length > 0) {
          toast({
            title: "Car Mode Activated",
            description: `Found ${carDevices.length} car audio system(s) nearby`,
            className: `${isDarkMode ? 'bg-blue-900/80 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-800'} backdrop-blur-md`
          });
        }
      } catch (error) {
        console.error('Car mode scan error:', error);
      }
    }
  };

  const handleVoiceCommand = (command: string, response: string) => {
    console.log('Voice command processed:', { command, response });
    
    // Handle specific commands that affect the UI
    if (command.toLowerCase().includes('car mode')) {
      toggleCarMode();
    }
    
    if (command.toLowerCase().includes('settings')) {
      setActiveView('settings');
    }
    
    if (command.toLowerCase().includes('music') || command.toLowerCase().includes('audio')) {
      setActiveView('audio');
    }
  };

  const CircularButton = ({ 
    icon: Icon, 
    label, 
    active = false, 
    onClick, 
    className = ""
  }: { 
    icon: any; 
    label: string; 
    active?: boolean; 
    onClick: () => void; 
    className?: string;
  }) => (
    <div 
      className={`
        relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl 
        cursor-pointer transition-all duration-300 transform hover:scale-105
        ${active 
          ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
          : isDarkMode 
            ? 'bg-white/10 hover:bg-white/20' 
            : 'bg-black/10 hover:bg-black/20'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <Icon className={`h-6 w-6 ${
        active 
          ? 'text-white' 
          : isDarkMode 
            ? 'text-white' 
            : 'text-gray-900'
      }`} />
      <span className={`
        absolute -bottom-6 text-xs font-medium whitespace-nowrap
        ${active 
          ? 'text-blue-400' 
          : isDarkMode 
            ? 'text-gray-400' 
            : 'text-gray-600'
        }
      `}>
        {label}
      </span>
    </div>
  );

  const dockItems = [
    {
      icon: <Home className="h-6 w-6" />,
      label: 'Main',
      onClick: () => setActiveView('main'),
      className: activeView === 'main' ? 'bg-blue-500' : ''
    },
    {
      icon: <Music className="h-6 w-6" />,
      label: 'Audio',
      onClick: () => setActiveView('audio'),
      className: activeView === 'audio' ? 'bg-blue-500' : ''
    },
    {
      icon: <Archive className="h-6 w-6" />,
      label: 'Automation',
      onClick: () => setActiveView('automation'),
      className: activeView === 'automation' ? 'bg-blue-500' : ''
    },
    {
      icon: <SettingsIcon className="h-6 w-6" />,
      label: 'Settings',
      onClick: () => setActiveView('settings'),
      className: activeView === 'settings' ? 'bg-blue-500' : ''
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'audio':
        return (
          <div className="space-y-6">
            <EnhancedAudioPlayer isDarkMode={isDarkMode} />
          </div>
        );
      case 'automation':
        return (
          <div className="space-y-6">
            <AutomationBuilder isDarkMode={isDarkMode} automationRules={automationRules} />
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <Settings isDarkMode={isDarkMode} />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <JarvisVoiceAssistant 
                isDarkMode={isDarkMode} 
                onCommand={handleVoiceCommand}
              />
              <DeviceManager isDarkMode={isDarkMode} connectedDevices={connectedDevices} />
            </div>
            <div className="space-y-6">
              <EnhancedAudioPlayer isDarkMode={isDarkMode} compact />
              
              <Card className={`p-6 transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-3xl shadow-2xl`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Enhanced System Status
                  </h3>
                  <StatusIndicators connectedDevices={connectedDevices} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${
                    bluetoothEnabled && connectedDevices.length > 0
                      ? isDarkMode 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-green-50 border-green-200'
                      : isDarkMode
                        ? 'bg-gray-500/10 border-gray-500/20'
                        : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Bluetooth className={`h-5 w-5 ${
                        bluetoothEnabled && connectedDevices.length > 0
                          ? isDarkMode ? 'text-green-400' : 'text-green-600'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div>
                        <p className={`font-semibold ${
                          bluetoothEnabled && connectedDevices.length > 0
                            ? isDarkMode ? 'text-green-300' : 'text-green-700'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Bluetooth
                        </p>
                        <p className={`text-sm ${
                          bluetoothEnabled && connectedDevices.length > 0
                            ? isDarkMode ? 'text-green-400' : 'text-green-600'
                            : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {connectedDevices.filter(d => d.device_type === 'bluetooth' || d.device_type === 'car').length} connected
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-blue-500/10 border-blue-500/20' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Zap className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          AI Assistant
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          Active & Learning
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isCarMode && (
                  <div className={`mt-4 p-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-purple-500/10 border-purple-500/20' 
                      : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Car className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                          Car Mode Active
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          Optimized for driving
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8 pb-32">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                WAMBUGU Hub
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isCarMode ? 'Car Mode Active - Voice Assistant Ready' : 'AI-Powered Smart Hub with JARVIS Integration'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CircularButton
              icon={Car}
              label="Car Mode"
              active={isCarMode}
              onClick={toggleCarMode}
            />
            <CircularButton
              icon={isDarkMode ? Sun : Moon}
              label="Theme"
              onClick={toggleTheme}
            />
          </div>
        </div>

        {renderContent()}
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Dock
          items={dockItems}
          magnification={80}
          distance={120}
          panelHeight={68}
          className={isDarkMode ? 'bg-black/40 border-white/20' : 'bg-white/40 border-black/20'}
        />
      </div>
    </div>
  );
};

export default WambuguHub;
