import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AudioProvider } from '@/contexts/AudioContext';
import VoiceInterface from './VoiceInterface';
import BluetoothManager from './BluetoothManager';
import EnhancedAudioPlayer from './EnhancedAudioPlayer';
import AutomationBuilder from './AutomationBuilder';
import StatusIndicators from './StatusIndicators';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Settings, 
  Moon, 
  Sun, 
  Car, 
  Home, 
  Activity,
  Minimize2
} from 'lucide-react';

const WambuguHub = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState('main');
  const [isCarMode, setIsCarMode] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);

  // Apply theme class to document with smooth transition
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
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
      sm: 'w-16 h-16',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
      xl: 'w-28 h-28'
    };

    return (
      <div className="flex flex-col items-center space-y-3">
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
          <Icon className={`h-8 w-8 ${active 
            ? (isDarkMode ? 'text-white' : 'text-purple-700') 
            : (isDarkMode ? 'text-white/80' : 'text-black/70')
          }`} />
        </Button>
        <span className={`text-base font-semibold text-center max-w-20 leading-tight ${
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
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Car Mode
                  </h1>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Voice-First Interface
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={toggleCarMode}
                className="rounded-full text-lg px-6 py-3 transition-all duration-300 hover:scale-105 transform bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
              >
                <Minimize2 className="h-5 w-5 mr-2" />
                Exit Car Mode
              </Button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto p-8 space-y-10">
            {/* Large Voice Interface */}
            <Card className={`p-10 border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
            } backdrop-blur-md rounded-3xl shadow-3xl hover:shadow-4xl transform hover:scale-102`}>
              <VoiceInterface isDarkMode={isDarkMode} />
            </Card>

            {/* Enhanced Car Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      <div className={`min-h-screen transition-all duration-700 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  WAMBUGU Hub
                </h1>
                <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveView('settings')}
                className={`rounded-full transition-all duration-300 hover:scale-105 transform ${
                  isDarkMode 
                    ? 'hover:bg-white/10 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8 space-y-8 relative z-10">
          {/* Main Dashboard View */}
          {activeView === 'main' && (
            <>
              {/* Voice Interface - Central Focus */}
              <Card className={`p-8 border transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-102`}>
                <VoiceInterface isDarkMode={isDarkMode} />
              </Card>

              {/* Quick Action Ring */}
              <Card className={`p-10 border transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl`}>
                <div className="text-center mb-8">
                  <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Quick Actions
                  </h2>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tap to activate modes and controls
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-12 items-center">
                    <CircularButton 
                      icon={Car} 
                      label="Car Mode" 
                      onClick={toggleCarMode}
                      active={isCarMode}
                    />
                    <CircularButton 
                      icon={Activity} 
                      label="Automation" 
                      onClick={() => setActiveView('automation')}
                      active={activeView === 'automation'}
                    />
                    <CircularButton 
                      icon={Home} 
                      label="Home Mode" 
                      onClick={() => console.log('Home mode activated')}
                    />
                  </div>
                </div>
              </Card>

              {/* Enhanced Device & Audio Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BluetoothManager isDarkMode={isDarkMode} />
                <EnhancedAudioPlayer isDarkMode={isDarkMode} compact={true} />
              </div>

              {/* Active Rules Summary */}
              <Card className={`p-6 border transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
              } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-102`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Active Automation Rules
                  </h3>
                  <Badge variant="outline" className={`text-lg px-4 py-2 ${
                    isDarkMode 
                      ? 'text-green-400 border-green-400/50 bg-green-400/10' 
                      : 'text-green-600 border-green-400 bg-green-50'
                  } backdrop-blur-md`}>
                    {automationRules.filter(rule => rule.enabled).length} Active
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {automationRules.slice(0, 3).map(rule => (
                    <div 
                      key={rule.id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                        isDarkMode 
                          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                          : 'bg-white/50 border-gray-200/30 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold text-lg ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {rule.name}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          rule.enabled ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {rule.execution_count} executions
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Automation Builder View */}
          {activeView === 'automation' && (
            <Card className={`p-8 border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
            } backdrop-blur-md rounded-3xl shadow-2xl`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Automation Builder
                </h2>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveView('main')}
                  className={`rounded-full text-lg px-6 py-3 transition-all duration-300 hover:scale-105 transform ${
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
        </div>
      </div>
    </AudioProvider>
  );
};

export default WambuguHub;
