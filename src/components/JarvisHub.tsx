
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import VoiceInterface from './VoiceInterface';
import DeviceManager from './DeviceManager';
import AudioCenter from './AudioCenter';
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
  Wifi,
  Activity,
  Minimize2,
  Maximize2
} from 'lucide-react';

const WambuguHub = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState('main');
  const [isCarMode, setIsCarMode] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [automationRules, setAutomationRules] = useState([]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
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
      // Speak car mode activation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Car mode activated. Drive safely!');
        speechSynthesis.speak(utterance);
      }
    }
  };

  const CircularButton = ({ icon: Icon, label, color, size = 'md', onClick, active = false }) => {
    const sizeClasses = {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-20 h-20',
      xl: 'w-24 h-24'
    };

    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={onClick}
          className={`
            ${sizeClasses[size]} rounded-full p-0 border-2 transition-all duration-300 
            hover:scale-105 transform shadow-lg hover:shadow-xl
            ${active 
              ? `${isDarkMode 
                  ? `bg-${color}-500/20 border-${color}-400/50 shadow-${color}-500/30` 
                  : `bg-${color}-100 border-${color}-400 shadow-${color}-300/50`
                }` 
              : `${isDarkMode 
                  ? `bg-${color}-500/10 border-${color}-500/30 hover:bg-${color}-500/20 hover:border-${color}-400/50`
                  : `bg-${color}-50 border-${color}-300 hover:bg-${color}-100 hover:border-${color}-400`
                }`
            }
          `}
        >
          <Icon className={`h-6 w-6 ${active 
            ? (isDarkMode ? 'text-white' : `text-${color}-700`) 
            : (isDarkMode ? `text-${color}-400` : `text-${color}-600`)
          }`} />
        </Button>
        <span className={`text-xs font-medium text-center max-w-16 leading-tight ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </span>
      </div>
    );
  };

  const QuickActionRing = () => (
    <div className="relative animate-fade-in">
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 items-center">
          <CircularButton 
            icon={Car} 
            label="Car Mode" 
            color="blue" 
            onClick={toggleCarMode}
            active={isCarMode}
          />
          <CircularButton 
            icon={Activity} 
            label="Automation" 
            color="green" 
            size="lg"
            onClick={() => setActiveView('automation')}
            active={activeView === 'automation'}
          />
          <CircularButton 
            icon={Home} 
            label="Home Mode" 
            color="purple" 
            onClick={() => console.log('Home mode activated')}
          />
        </div>
      </div>
    </div>
  );

  // Car Mode UI
  if (isCarMode) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
      }`}>
        {/* Car Mode Header */}
        <div className={`backdrop-blur-md border-b p-4 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/50 border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Car className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Car Mode
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Voice-first driving interface
                </p>
              </div>
            </div>
            
            <Button 
              onClick={toggleCarMode}
              className="rounded-full transition-all duration-300 hover:scale-105 transform"
            >
              <Minimize2 className="h-5 w-5 mr-2" />
              Exit Car Mode
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Large Voice Interface for Car Mode */}
          <Card className={`p-8 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/5 border-white/10 hover:bg-white/8' 
              : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
          } backdrop-blur-md rounded-3xl shadow-2xl`}>
            <VoiceInterface isDarkMode={isDarkMode} />
          </Card>

          {/* Quick Car Actions */}
          <div className="grid grid-cols-2 gap-6">
            <Card className={`p-6 border transition-all duration-300 hover:scale-105 transform ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            } backdrop-blur-md rounded-2xl shadow-lg`}>
              <AudioCenter isDarkMode={isDarkMode} compact={true} />
            </Card>

            <Card className={`p-6 border transition-all duration-300 hover:scale-105 transform ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            } backdrop-blur-md rounded-2xl shadow-lg`}>
              <DeviceManager 
                connectedDevices={connectedDevices} 
                isDarkMode={isDarkMode}
                compact={true}
              />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-md border-b p-4 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-black/20 border-white/10' 
          : 'bg-white/50 border-gray-200/50'
      }`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                WAMBUGU Hub
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Smart Automation Assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Main Dashboard View */}
        {activeView === 'main' && (
          <>
            {/* Voice Interface - Central Focus */}
            <Card className={`p-6 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            } backdrop-blur-md rounded-2xl shadow-lg`}>
              <VoiceInterface isDarkMode={isDarkMode} />
            </Card>

            {/* Quick Action Ring */}
            <Card className={`p-8 border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            } backdrop-blur-md rounded-2xl shadow-lg`}>
              <div className="text-center mb-6">
                <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tap to activate modes and controls
                </p>
              </div>
              <QuickActionRing />
            </Card>

            {/* Compact Device & Audio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`p-4 border transition-all duration-300 hover:scale-102 transform ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
              } backdrop-blur-md rounded-2xl shadow-lg`}>
                <DeviceManager 
                  connectedDevices={connectedDevices} 
                  isDarkMode={isDarkMode}
                  compact={true}
                />
              </Card>

              <Card className={`p-4 border transition-all duration-300 hover:scale-102 transform ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                  : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
              } backdrop-blur-md rounded-2xl shadow-lg`}>
                <AudioCenter isDarkMode={isDarkMode} compact={true} />
              </Card>
            </div>

            {/* Active Rules Summary */}
            <Card className={`p-4 border transition-all duration-300 hover:scale-102 transform ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
            } backdrop-blur-md rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Active Automation Rules
                </h3>
                <Badge variant="outline" className={`${
                  isDarkMode 
                    ? 'text-green-400 border-green-400/50 bg-green-400/10' 
                    : 'text-green-600 border-green-400 bg-green-50'
                } backdrop-blur-md`}>
                  {automationRules.filter(rule => rule.enabled).length} Active
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {automationRules.slice(0, 3).map(rule => (
                  <div 
                    key={rule.id}
                    className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 transform ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 hover:bg-white/8' 
                        : 'bg-white/50 border-gray-200/30 hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium text-sm ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {rule.name}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${
                        rule.enabled ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
          <Card className={`p-6 border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-white/5 border-white/10 hover:bg-white/8' 
              : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
          } backdrop-blur-md rounded-2xl shadow-lg`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Automation Builder
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveView('main')}
                className={`rounded-full transition-all duration-300 hover:scale-105 transform ${
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
  );
};

export default WambuguHub;
