
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  Mic, 
  Globe, 
  Shield, 
  Bell,
  Bluetooth,
  Wifi,
  Database,
  User,
  Palette,
  Save
} from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode }) => {
  const [settings, setSettings] = useState({
    // Audio Settings
    masterVolume: 75,
    microphoneGain: 60,
    voiceActivation: true,
    backgroundMusic: false,
    
    // Voice Settings
    wakeWord: 'Hey WAMBUGU',
    customWakeWord: '',
    voiceTimeout: 30,
    continuousListening: false,
    
    // Connectivity Settings
    autoConnect: true,
    dataUsage: 'wifi-and-data', // 'wifi-only', 'data-only', 'wifi-and-data'
    bluetoothDiscovery: true,
    wifiPreferred: true,
    
    // Notification Settings
    pushNotifications: true,
    soundAlerts: true,
    vibrationFeedback: true,
    automationAlerts: true,
    
    // Privacy Settings
    dataCollection: false,
    anonymousUsage: true,
    locationServices: false,
    cameraAccess: false,
    
    // Theme Settings
    autoTheme: false,
    reducedMotion: false,
    fontSize: 16,
    compactMode: false
  });

  const [recordingWakeWord, setRecordingWakeWord] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleWakeWordRecording = () => {
    setRecordingWakeWord(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setRecordingWakeWord(false);
      // Here you would process the recorded audio
    }, 3000);
  };

  const SettingCard = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <Card className={`p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-white/5 border-white/10 hover:bg-white/8' 
        : 'bg-white border-gray-200 hover:bg-gray-50'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );

  const SliderSetting = ({ label, value, onChange, min = 0, max = 100, step = 1 }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</Label>
        <Badge variant="outline" className="text-sm">
          {value}{max === 100 ? '%' : ''}
        </Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full touch-manipulation"
        style={{ touchAction: 'manipulation' }}
      />
    </div>
  );

  const SwitchSetting = ({ label, checked, onChange, description }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-1 flex-1">
        <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</Label>
        {description && (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onChange}
        className="ml-4"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Audio Settings */}
      <SettingCard icon={Volume2} title="Audio Settings">
        <SliderSetting
          label="Master Volume"
          value={settings.masterVolume}
          onChange={(value) => updateSetting('masterVolume', value)}
        />
        <SliderSetting
          label="Microphone Gain"
          value={settings.microphoneGain}
          onChange={(value) => updateSetting('microphoneGain', value)}
        />
        <SwitchSetting
          label="Voice Activation"
          checked={settings.voiceActivation}
          onChange={(checked) => updateSetting('voiceActivation', checked)}
          description="Automatically listen for voice commands"
        />
        <SwitchSetting
          label="Background Music"
          checked={settings.backgroundMusic}
          onChange={(checked) => updateSetting('backgroundMusic', checked)}
          description="Play ambient sounds during operation"
        />
      </SettingCard>

      {/* Voice Settings */}
      <SettingCard icon={Mic} title="Voice Settings">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Wake Word</Label>
            <div className="flex gap-2">
              <Input
                value={settings.wakeWord}
                onChange={(e) => updateSetting('wakeWord', e.target.value)}
                placeholder="Enter wake word"
                className="flex-1"
              />
              <Button
                onClick={handleWakeWordRecording}
                disabled={recordingWakeWord}
                className="min-w-[100px]"
              >
                {recordingWakeWord ? 'Recording...' : 'Record'}
              </Button>
            </div>
            {recordingWakeWord && (
              <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Say your wake word clearly...
              </p>
            )}
          </div>
          <SliderSetting
            label="Voice Timeout (seconds)"
            value={settings.voiceTimeout}
            onChange={(value) => updateSetting('voiceTimeout', value)}
            min={5}
            max={60}
          />
          <SwitchSetting
            label="Continuous Listening"
            checked={settings.continuousListening}
            onChange={(checked) => updateSetting('continuousListening', checked)}
            description="Keep microphone active for follow-up commands"
          />
        </div>
      </SettingCard>

      {/* Connectivity Settings */}
      <SettingCard icon={Globe} title="Connectivity">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Data Usage</Label>
            <div className="flex gap-2">
              {[
                { value: 'wifi-only', label: 'WiFi Only' },
                { value: 'data-only', label: 'Data Only' },
                { value: 'wifi-and-data', label: 'WiFi & Data' }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={settings.dataUsage === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('dataUsage', option.value)}
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <SwitchSetting
            label="Auto Connect"
            checked={settings.autoConnect}
            onChange={(checked) => updateSetting('autoConnect', checked)}
            description="Automatically connect to known devices"
          />
          <SwitchSetting
            label="Bluetooth Discovery"
            checked={settings.bluetoothDiscovery}
            onChange={(checked) => updateSetting('bluetoothDiscovery', checked)}
            description="Allow other devices to discover this device"
          />
          <SwitchSetting
            label="Prefer WiFi"
            checked={settings.wifiPreferred}
            onChange={(checked) => updateSetting('wifiPreferred', checked)}
            description="Use WiFi when available to save mobile data"
          />
        </div>
      </SettingCard>

      {/* Notifications */}
      <SettingCard icon={Bell} title="Notifications">
        <SwitchSetting
          label="Push Notifications"
          checked={settings.pushNotifications}
          onChange={(checked) => updateSetting('pushNotifications', checked)}
          description="Receive system and automation notifications"
        />
        <SwitchSetting
          label="Sound Alerts"
          checked={settings.soundAlerts}
          onChange={(checked) => updateSetting('soundAlerts', checked)}
          description="Play sounds for important alerts"
        />
        <SwitchSetting
          label="Vibration Feedback"
          checked={settings.vibrationFeedback}
          onChange={(checked) => updateSetting('vibrationFeedback', checked)}
          description="Vibrate for notifications and confirmations"
        />
        <SwitchSetting
          label="Automation Alerts"
          checked={settings.automationAlerts}
          onChange={(checked) => updateSetting('automationAlerts', checked)}
          description="Notify when automation rules execute"
        />
      </SettingCard>

      {/* Privacy Settings */}
      <SettingCard icon={Shield} title="Privacy & Security">
        <SwitchSetting
          label="Data Collection"
          checked={settings.dataCollection}
          onChange={(checked) => updateSetting('dataCollection', checked)}
          description="Allow collection of usage data for improvements"
        />
        <SwitchSetting
          label="Anonymous Usage Statistics"
          checked={settings.anonymousUsage}
          onChange={(checked) => updateSetting('anonymousUsage', checked)}
          description="Share anonymous performance data"
        />
        <SwitchSetting
          label="Location Services"
          checked={settings.locationServices}
          onChange={(checked) => updateSetting('locationServices', checked)}
          description="Allow location-based automation"
        />
        <SwitchSetting
          label="Camera Access"
          checked={settings.cameraAccess}
          onChange={(checked) => updateSetting('cameraAccess', checked)}
          description="Enable camera for QR code scanning"
        />
      </SettingCard>

      {/* Theme & Appearance */}
      <SettingCard icon={Palette} title="Theme & Appearance">
        <SwitchSetting
          label="Auto Theme"
          checked={settings.autoTheme}
          onChange={(checked) => updateSetting('autoTheme', checked)}
          description="Automatically switch between light and dark mode"
        />
        <SwitchSetting
          label="Reduced Motion"
          checked={settings.reducedMotion}
          onChange={(checked) => updateSetting('reducedMotion', checked)}
          description="Minimize animations and transitions"
        />
        <SliderSetting
          label="Font Size"
          value={settings.fontSize}
          onChange={(value) => updateSetting('fontSize', value)}
          min={12}
          max={24}
        />
        <SwitchSetting
          label="Compact Mode"
          checked={settings.compactMode}
          onChange={(checked) => updateSetting('compactMode', checked)}
          description="Show more content with smaller spacing"
        />
      </SettingCard>

      {/* Save Button */}
      <Card className={`p-4 ${
        isDarkMode 
          ? 'bg-white/5 border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <Button className="w-full" size="lg">
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </Button>
      </Card>
    </div>
  );
};

export default Settings;
