
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AudioProvider } from '@/contexts/AudioContext';
import VoiceInterface from './VoiceInterface';
import BluetoothManager from './BluetoothManager';
import EnhancedAudioPlayer from './EnhancedAudioPlayer';
import AutomationBuilder from './AutomationBuilder';
import StatusIndicators from './StatusIndicators';
import Settings from './Settings';
import Dock from './Dock';
import AudioPage from './AudioPage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Car, 
  Home, 
  Activity,
  Minimize2,
  Music,
  Archive
} from 'lucide-react';

const WambuguHub = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState<'main' | 'automation' | 'settings' | 'audio'>('main');
  const [isCarMode, setIsCarMode] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);

  // Apply theme class to document with smooth transition
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
  }, [isDarkMode]);

  // Fetch connected devices
  const { data: devices } = useQuery({
    queryKey: ['device-connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('device_connections')
        .select('*')
        .order('last_connected_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch automation rules
  const { data: rules } = useQuery({
    queryKey: ['automation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (devices) setConnectedDevices(devices);
  }, [devices]);

  useEffect(() => {
    if (rules) setAutomationRules(rules);
  }, [rules]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleCarMode = () => {
    setIsCarMode(!isCarMode);
    if (!isCarMode) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Car mode activated. Drive safely!');
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Simple dock items with correct Lucide icons
  const dockItems = [
    { 
      icon: <Home size={18} />, 
      label: 'Home', 
      onClick: () => setActiveView('main')
    },
    { 
      icon: <Activity size={18} />, 
      label: 'Automation', 
      onClick: () => setActiveView('automation')
    },
    { 
      icon: <Music size={18} />, 
      label: 'Audio', 
      onClick: () => setActiveView('audio')
    },
    { 
      icon: <Car size={18} />, 
      label: 'Car Mode', 
      onClick: toggleCarMode
    },
    { 
      icon: <SettingsIcon size={18} />, 
      label: 'Settings', 
      onClick: () => setActiveView('settings')
    },
  ];

  const CircularButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    active = false, 
    size = 'lg' 
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    active?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }) => {
    const sizeClasses = {
      sm: 'w-12 h-12 sm:w-14 sm:h-14',
      md: 'w-14 h-14 sm:w-16 sm:h-16',
      lg: 'w-16 h-16 sm:w-20 sm:h-20',
      xl: 'w-20 h-20 sm:w-24 sm:h-24'
    };

    const iconSizes = {
      sm: 'h-4 w-4 sm:h-5 sm:w-5',
      md: 'h-5 w-5 sm:h-6 sm:w-6',
      lg: 'h-6 w-6 sm:h-7 sm:w-7',
      xl: 'h-7 w-7 sm:h-8 sm:w-8'
    };

    const textSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm sm:text-base',
      xl: 'text-base'
    };

    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={onClick}
          className={`
            ${sizeClasses[size]} rounded-full p-0 border-2 transition-all duration-500 
            hover:scale-110 transform shadow-2xl hover:shadow-3xl backdrop-blur-md
            ${active 
              ? `${isDarkMode 
                  ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/60 shadow-blue-500/50' 
                  : 'bg-gradient-to-br from-blue-200 to-purple-200 border-blue-400 shadow-blue-300/60'
                }` 
              : `${isDarkMode 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                  : 'bg-black/5 border-black/10 hover:bg-black/10 hover:border-black/20'
                }`
            }
          `}
        >
          <Icon className={`${iconSizes[size]} ${active 
            ? (isDarkMode ? 'text-white' : 'text-purple-700') 
            : (isDarkMode ? 'text-white/80' : 'text-black/70')
          }`} />
        </Button>
        <span className={`${textSizes[size]} font-bold text-center max-w-16 leading-tight ${
          isDarkMode ? 'text-white/90' : 'text-black/80'
        }`}>
          {label}
        </span>
      </div>
    );
  };

  // Car Mode UI with enhanced voice focus
  if (isCarMode) {
    return (
      <AudioProvider>
        <div className={`min-h-screen transition-all duration-700 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white' 
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
        }`}>
          {/* Enhanced Car Mode Header */}
          <div className={`backdrop-blur-md border-b p-4 transition-all duration-500 ${
            isDarkMode 
              ? 'bg-black/30 border-white/10' 
              : 'bg-white/60 border-gray-200/50'
          }`}>
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Car Mode
                  </h1>
                  <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Voice-First Interface
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={toggleCarMode}
                className="rounded-full text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 hover:scale-105 transform bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
              >
                <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Exit Car Mode
              </Button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 md:space-y-10">
            {/* Large Voice Interface */}
            <Card className={`p-6 md:p-10 border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
            } backdrop-blur-md rounded-3xl shadow-3xl hover:shadow-4xl transform hover:scale-102`}>
              <VoiceInterface isDarkMode={isDarkMode} />
            </Card>

            {/* Enhanced Car Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <EnhancedAudioPlayer isDarkMode={isDarkMode} compact={true} />
              <BluetoothManager isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </AudioProvider>
    );
  }

  return (
    <AudioProvider>
      <div className={`min-h-screen transition-all duration-700 relative overflow-hidden pb-32 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white dark' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 light'
      }`}>
        {/* Silk Background Effect */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Enhanced Header */}
        <div className={`backdrop-blur-md border-b p-4 transition-all duration-500 relative z-10 ${
          isDarkMode 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/50 border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  WAMBUGU Hub
                </h1>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Smart Automation Assistant
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <StatusIndicators connectedDevices={connectedDevices} />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className={`rounded-full transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode 
                    ? 'hover:bg-white/10 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 md:space-y-8 relative z-10 pb-32">
          {/* Main Dashboard View */}
          {activeView === 'main' && (
            <>
              {/* Voice Interface - Central Focus */}
              <Card className={`p-6 md:p-8 border transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-102`}>
                <VoiceInterface isDarkMode={isDarkMode} />
              </Card>

              {/* Quick Action Ring - Responsive */}
              <Card className={`p-6 md:p-10 border transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl`}>
                <div className="text-center mb-6 md:mb-8">
                  <h2 className={`text-xl md:text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Quick Actions
                  </h2>
                  <p className={`text-base md:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tap to activate modes and controls
                  </p>
                </div>
                <div className="flex justify-center overflow-x-auto px-4">
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center min-w-fit">
                    <CircularButton 
                      icon={Car} 
                      label="Car Mode" 
                      onClick={toggleCarMode}
                      active={isCarMode}
                      size="md"
                    />
                    <CircularButton 
                      icon={Activity} 
                      label="Automation" 
                      onClick={() => setActiveView('automation')}
                      active={activeView === 'automation'}
                      size="md"
                    />
                    <CircularButton 
                      icon={Home} 
                      label="Home Mode" 
                      onClick={() => console.log('Home mode activated')}
                      size="md"
                    />
                  </div>
                </div>
              </Card>

              {/* Enhanced Device & Audio Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <BluetoothManager isDarkMode={isDarkMode} />
                <EnhancedAudioPlayer isDarkMode={isDarkMode} compact={true} />
              </div>

              {/* Active Rules Summary with bottom padding for dock */}
              <Card className={`p-4 md:p-6 border transition-all duration-500 mb-32 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-102`}>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className={`text-lg md:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Active Automation Rules
                  </h3>
                  <Badge variant="outline" className={`text-base md:text-lg px-3 md:px-4 py-1 md:py-2 ${
                    isDarkMode 
                      ? 'text-green-400 border-green-400/50 bg-green-400/10' 
                      : 'text-green-600 border-green-400 bg-green-50'
                  } backdrop-blur-md`}>
                    {automationRules.filter(rule => rule.enabled).length} Active
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  {automationRules.slice(0, 3).map(rule => (
                    <div 
                      key={rule.id}
                      className={`p-3 md:p-4 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                          : 'bg-white/50 border-gray-200/30 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold text-base md:text-lg ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {rule.name}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          rule.enabled ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {rule.execution_count} executions
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Audio View */}
          {activeView === 'audio' && (
            <AudioPage isDarkMode={isDarkMode} />
          )}

          {/* Automation Builder View */}
          {activeView === 'automation' && (
            <Card className={`p-6 md:p-8 border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
            } backdrop-blur-md rounded-3xl shadow-2xl`}>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Automation Builder
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveView('main')}
                  className={`rounded-full text-base md:text-lg px-4 md:px-6 py-2 md:py-3 transition-all duration-300 hover:scale-105 transform ${
                    isDarkMode 
                      ? 'border-white/20 hover:bg-white/10 hover:border-white/30' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Back to Dashboard
                </Button>
              </div>
              <AutomationBuilder 
                automationRules={automationRules} 
                isDarkMode={isDarkMode}
              />
            </Card>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <Card className={`p-6 md:p-8 border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
            } backdrop-blur-md rounded-3xl shadow-2xl`}>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Settings
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveView('main')}
                  className={`rounded-full text-base md:text-lg px-4 md:px-6 py-2 md:py-3 transition-all duration-300 hover:scale-105 transform ${
                    isDarkMode 
                      ? 'border-white/20 hover:bg-white/10 hover:border-white/30' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Back to Dashboard
                </Button>
              </div>
              <Settings isDarkMode={isDarkMode} />
            </Card>
          )}
        </div>

        {/* Dock */}
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </AudioProvider>
  );
};

export default WambuguHub;
