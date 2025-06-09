
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bluetooth, 
  Volume2, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import VoiceInterface from '@/components/VoiceInterface';
import DeviceManager from '@/components/DeviceManager';
import AutomationBuilder from '@/components/AutomationBuilder';
import AudioCenter from '@/components/AudioCenter';
import StatusIndicators from '@/components/StatusIndicators';

const Index = () => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Car Audio System', type: 'bluetooth', status: 'connected', signal: 85 },
    { id: 2, name: 'Sony WH-1000XM4', type: 'bluetooth', status: 'connected', signal: 92 },
    { id: 3, name: 'Home Speaker', type: 'wifi', status: 'disconnected', signal: 0 }
  ]);
  
  const [activeAutomations, setActiveAutomations] = useState([
    { id: 1, name: 'Car Connect', enabled: true, lastTriggered: '2 min ago' },
    { id: 2, name: 'Evening Routine', enabled: true, lastTriggered: 'Never' },
    { id: 3, name: 'Home Arrival', enabled: false, lastTriggered: '1 hour ago' }
  ]);

  const [currentTrack, setCurrentTrack] = useState({
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    currentTime: 142,
    isPlaying: true
  });

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  if (isVoiceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <VoiceInterface 
          onExitVoiceMode={() => setIsVoiceMode(false)}
          connectedDevices={connectedDevices}
          currentTrack={currentTrack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JARVIS Assistant
            </h1>
            <p className="text-muted-foreground mt-2">Smart Automation & Audio Control</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={toggleVoiceMode}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              Voice Mode
            </Button>
            <StatusIndicators connectedDevices={connectedDevices} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Devices</p>
                  <p className="text-2xl font-bold text-green-600">
                    {connectedDevices.filter(d => d.status === 'connected').length}
                  </p>
                </div>
                <Bluetooth className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Automations</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeAutomations.filter(a => a.enabled).length}
                  </p>
                </div>
                <ArrowUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Audio Quality</p>
                  <p className="text-2xl font-bold text-purple-600">FLAC</p>
                </div>
                <Volume2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Voice Commands</p>
                  <p className="text-2xl font-bold text-orange-600">42</p>
                </div>
                <ArrowDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="audio">Audio Center</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Automations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Automations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeAutomations.map(automation => (
                    <div key={automation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Badge variant={automation.enabled ? "default" : "secondary"}>
                          {automation.enabled ? "Active" : "Inactive"}
                        </Badge>
                        <div>
                          <p className="font-medium">{automation.name}</p>
                          <p className="text-sm text-muted-foreground">Last: {automation.lastTriggered}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Currently Playing */}
              <Card>
                <CardHeader>
                  <CardTitle>Now Playing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <Volume2 className="h-16 w-16 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentTrack.title}</h3>
                      <p className="text-muted-foreground">{currentTrack.artist}</p>
                      <p className="text-sm text-muted-foreground">{currentTrack.album}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={(currentTrack.currentTime / currentTrack.duration) * 100} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{Math.floor(currentTrack.currentTime / 60)}:{(currentTrack.currentTime % 60).toString().padStart(2, '0')}</span>
                      <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <DeviceManager 
              devices={connectedDevices}
              onDeviceUpdate={setConnectedDevices}
            />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationBuilder 
              automations={activeAutomations}
              onAutomationUpdate={setActiveAutomations}
            />
          </TabsContent>

          <TabsContent value="audio">
            <AudioCenter 
              currentTrack={currentTrack}
              onTrackUpdate={setCurrentTrack}
              connectedDevices={connectedDevices.filter(d => d.status === 'connected')}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
