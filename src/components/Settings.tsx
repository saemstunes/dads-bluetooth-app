
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Volume2, 
  Mic, 
  Bluetooth, 
  Wifi, 
  Bell, 
  Eye, 
  Palette,
  Globe,
  Shield,
  Battery
} from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const [audioSettings, setAudioSettings] = useState({
    masterVolume: 75,
    voiceVolume: 85,
    notificationVolume: 60,
    autoConnect: true,
    highQualityAudio: true
  });

  const [voiceSettings, setVoiceSettings] = useState({
    wakeWord: 'Hey WAMBUGU',
    language: 'English',
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    continuousListening: false
  });

  const [systemSettings, setSystemSettings] = useState({
    notifications: true,
    vibration: true,
    autoLaunch: false,
    batteryOptimization: true,
    dataUsage: 'WiFi Only'
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: false,
    analytics: true,
    crashReports: true,
    locationAccess: false
  });

  const { toast } = useToast();

  const ElasticSlider = ({ value, onChange, max = 100, label }: {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    label: string;
  }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(Math.round(value));

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      updateValue(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onChange(localValue);
    };

    const updateValue = (e: MouseEvent | React.MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newValue = Math.round(percentage * max);
      setLocalValue(newValue);
    };

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging]);

    React.useEffect(() => {
      if (!isDragging) {
        setLocalValue(Math.round(value));
      }
    }, [value, isDragging]);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </span>
          <span className={`text-lg font-bold ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
            {localValue}%
          </span>
        </div>
        <div className="relative w-full h-3">
          <div 
            className="w-full h-3 bg-white/10 rounded-full cursor-pointer transition-all duration-300 hover:bg-white/20"
            onMouseDown={handleMouseDown}
          >
            <div 
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${(localValue / max) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <div 
              className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-300 hover:scale-110"
              style={{ left: `calc(${(localValue / max) * 100}% - 10px)` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const ToggleSwitch = ({ value, onChange, label }: {
    value: boolean;
    onChange: (value: boolean) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {label}
      </span>
      <Button
        onClick={() => onChange(!value)}
        className={`w-14 h-8 rounded-full transition-all duration-300 ${
          value 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : isDarkMode ? 'bg-white/20' : 'bg-gray-300'
        }`}
      >
        <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
          value ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </Button>
    </div>
  );

  const saveSettings = () => {
    // Save settings to localStorage or API
    const allSettings = {
      audio: audioSettings,
      voice: voiceSettings,
      system: systemSettings,
      privacy: privacySettings
    };
    
    localStorage.setItem('wambugu-settings', JSON.stringify(allSettings));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully",
      className: `${isDarkMode ? 'bg-green-900/80 border-green-700 text-green-200' : 'bg-green-50 border-green-300 text-green-800'} backdrop-blur-md`
    });
  };

  const resetSettings = () => {
    setAudioSettings({
      masterVolume: 75,
      voiceVolume: 85,
      notificationVolume: 60,
      autoConnect: true,
      highQualityAudio: true
    });
    
    setVoiceSettings({
      wakeWord: 'Hey WAMBUGU',
      language: 'English',
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      continuousListening: false
    });
    
    setSystemSettings({
      notifications: true,
      vibration: true,
      autoLaunch: false,
      batteryOptimization: true,
      dataUsage: 'WiFi Only'
    });
    
    setPrivacySettings({
      dataCollection: false,
      analytics: true,
      crashReports: true,
      locationAccess: false
    });

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults",
      className: `${isDarkMode ? 'bg-blue-900/80 border-blue-700 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-800'} backdrop-blur-md`
    });
  };

  return (
    <div className="space-y-8">
      {/* Audio Settings */}
      <Card className={`p-6 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
          : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
      } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl`}>
        <div className="flex items-center mb-6">
          <Volume2 className="h-6 w-6 mr-3 text-blue-400" />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Audio Settings
          </h3>
        </div>
        
        <div className="space-y-6">
          <ElasticSlider
            value={audioSettings.masterVolume}
            onChange={(value) => setAudioSettings(prev => ({ ...prev, masterVolume: value }))}
            label="Master Volume"
          />
          <ElasticSlider
            value={audioSettings.voiceVolume}
            onChange={(value) => setAudioSettings(prev => ({ ...prev, voiceVolume: value }))}
            label="Voice Volume"
          />
          <ElasticSlider
            value={audioSettings.notificationVolume}
            onChange={(value) => setAudioSettings(prev => ({ ...prev, notificationVolume: value }))}
            label="Notification Volume"
          />
          <ToggleSwitch
            value={audioSettings.autoConnect}
            onChange={(value) => setAudioSettings(prev => ({ ...prev, autoConnect: value }))}
            label="Auto-Connect Bluetooth"
          />
          <ToggleSwitch
            value={audioSettings.highQualityAudio}
            onChange={(value) => setAudioSettings(prev => ({ ...prev, highQualityAudio: value }))}
            label="High Quality Audio"
          />
        </div>
      </Card>

      {/* Voice Settings */}
      <Card className={`p-6 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
          : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
      } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl`}>
        <div className="flex items-center mb-6">
          <Mic className="h-6 w-6 mr-3 text-green-400" />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Voice Settings
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Wake Word
            </span>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {voiceSettings.wakeWord}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Language
            </span>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {voiceSettings.language}
            </Badge>
          </div>
          
          <ElasticSlider
            value={voiceSettings.voiceSpeed * 100}
            onChange={(value) => setVoiceSettings(prev => ({ ...prev, voiceSpeed: value / 100 }))}
            label="Voice Speed"
            max={200}
          />
          <ElasticSlider
            value={voiceSettings.voicePitch * 100}
            onChange={(value) => setVoiceSettings(prev => ({ ...prev, voicePitch: value / 100 }))}
            label="Voice Pitch"
            max={200}
          />
          <ToggleSwitch
            value={voiceSettings.continuousListening}
            onChange={(value) => setVoiceSettings(prev => ({ ...prev, continuousListening: value }))}
            label="Continuous Listening"
          />
        </div>
      </Card>

      {/* System Settings */}
      <Card className={`p-6 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
          : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
      } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl`}>
        <div className="flex items-center mb-6">
          <Battery className="h-6 w-6 mr-3 text-yellow-400" />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            System Settings
          </h3>
        </div>
        
        <div className="space-y-6">
          <ToggleSwitch
            value={systemSettings.notifications}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, notifications: value }))}
            label="Push Notifications"
          />
          <ToggleSwitch
            value={systemSettings.vibration}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, vibration: value }))}
            label="Vibration"
          />
          <ToggleSwitch
            value={systemSettings.autoLaunch}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, autoLaunch: value }))}
            label="Auto Launch on Boot"
          />
          <ToggleSwitch
            value={systemSettings.batteryOptimization}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, batteryOptimization: value }))}
            label="Battery Optimization"
          />
          
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Data Usage
            </span>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {systemSettings.dataUsage}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className={`p-6 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10 hover:bg-white/8' 
          : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
      } backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl`}>
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 mr-3 text-red-400" />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Privacy & Security
          </h3>
        </div>
        
        <div className="space-y-6">
          <ToggleSwitch
            value={privacySettings.dataCollection}
            onChange={(value) => setPrivacySettings(prev => ({ ...prev, dataCollection: value }))}
            label="Data Collection"
          />
          <ToggleSwitch
            value={privacySettings.analytics}
            onChange={(value) => setPrivacySettings(prev => ({ ...prev, analytics: value }))}
            label="Usage Analytics"
          />
          <ToggleSwitch
            value={privacySettings.crashReports}
            onChange={(value) => setPrivacySettings(prev => ({ ...prev, crashReports: value }))}
            label="Crash Reports"
          />
          <ToggleSwitch
            value={privacySettings.locationAccess}
            onChange={(value) => setPrivacySettings(prev => ({ ...prev, locationAccess: value }))}
            label="Location Access"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={saveSettings}
          className="flex-1 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 transform transition-all duration-300"
        >
          Save Settings
        </Button>
        <Button
          onClick={resetSettings}
          variant="outline"
          className="flex-1 py-4 text-lg font-bold rounded-2xl hover:scale-105 transform transition-all duration-300"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;
