
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, ArrowUp, ArrowDown, Bluetooth } from 'lucide-react';

interface AudioCenterProps {
  currentTrack: {
    title: string;
    artist: string;
    album: string;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
  };
  onTrackUpdate: (track: any) => void;
  connectedDevices: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
  }>;
}

const AudioCenter: React.FC<AudioCenterProps> = ({ 
  currentTrack, 
  onTrackUpdate, 
  connectedDevices 
}) => {
  const [volume, setVolume] = useState([75]);
  const [selectedOutput, setSelectedOutput] = useState('Car Audio System');
  const [equalizer, setEqualizer] = useState({
    bass: [50],
    mid: [50],
    treble: [50]
  });

  const audioFormats = [
    { name: 'FLAC', quality: 'Lossless', supported: true },
    { name: 'MP3', quality: '320kbps', supported: true },
    { name: 'WAV', quality: 'Lossless', supported: true },
    { name: 'AAC', quality: '256kbps', supported: true },
    { name: 'OGG', quality: 'Variable', supported: true }
  ];

  const playlists = [
    { name: 'Driving Mix', tracks: 45, duration: '3h 12m' },
    { name: 'Workout Energy', tracks: 32, duration: '2h 18m' },
    { name: 'Chill Vibes', tracks: 28, duration: '1h 45m' },
    { name: 'Focus Mode', tracks: 20, duration: '1h 30m' }
  ];

  const togglePlayback = () => {
    onTrackUpdate({
      ...currentTrack,
      isPlaying: !currentTrack.isPlaying
    });
  };

  const nextTrack = () => {
    // Simulate next track
    onTrackUpdate({
      title: 'Stairway to Heaven',
      artist: 'Led Zeppelin',
      album: 'Led Zeppelin IV',
      duration: 482,
      currentTime: 0,
      isPlaying: true
    });
  };

  const previousTrack = () => {
    // Simulate previous track
    onTrackUpdate({
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 391,
      currentTime: 0,
      isPlaying: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Audio Control Center</h2>
          <p className="text-muted-foreground">Universal audio management and playback</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            FLAC Quality
          </Badge>
          <Badge variant="outline">
            {connectedDevices.length} Devices
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Player */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Now Playing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Album Art and Track Info */}
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Volume2 className="h-16 w-16 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                <p className="text-lg text-muted-foreground">{currentTrack.artist}</p>
                <p className="text-sm text-muted-foreground">{currentTrack.album}</p>
                <Badge variant="secondary">Rock • 1975</Badge>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={previousTrack}>
                  <ArrowUp className="h-5 w-5 rotate-[-90deg]" />
                </Button>
                <Button size="lg" onClick={togglePlayback} className="w-16 h-16 rounded-full">
                  {currentTrack.isPlaying ? '⏸️' : '▶️'}
                </Button>
                <Button variant="outline" size="lg" onClick={nextTrack}>
                  <ArrowUp className="h-5 w-5 rotate-90" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[(currentTrack.currentTime / currentTrack.duration) * 100]}
                  onValueChange={([value]) => {
                    onTrackUpdate({
                      ...currentTrack,
                      currentTime: Math.floor((value / 100) * currentTrack.duration)
                    });
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.floor(currentTrack.currentTime / 60)}:{(currentTrack.currentTime % 60).toString().padStart(2, '0')}</span>
                  <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Volume and Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Volume</label>
                <div className="flex items-center gap-3">
                  <Volume2 className="h-4 w-4" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-8">{volume[0]}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Device</label>
                <Select value={selectedOutput} onValueChange={setSelectedOutput}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedDevices.map(device => (
                      <SelectItem key={device.id} value={device.name}>
                        <div className="flex items-center gap-2">
                          <Bluetooth className="h-4 w-4" />
                          {device.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Format Support */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {audioFormats.map(format => (
                <div key={format.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{format.name}</p>
                    <p className="text-sm text-muted-foreground">{format.quality}</p>
                  </div>
                  <Badge variant={format.supported ? "default" : "secondary"}>
                    {format.supported ? "✓" : "○"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Playlists */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {playlists.map(playlist => (
                <div key={playlist.name} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {playlist.tracks} tracks • {playlist.duration}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Equalizer */}
      <Card>
        <CardHeader>
          <CardTitle>Audio Equalizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bass</label>
              <Slider
                value={equalizer.bass}
                onValueChange={(value) => setEqualizer({...equalizer, bass: value})}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">{equalizer.bass[0]}%</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mid</label>
              <Slider
                value={equalizer.mid}
                onValueChange={(value) => setEqualizer({...equalizer, mid: value})}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">{equalizer.mid[0]}%</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Treble</label>
              <Slider
                value={equalizer.treble}
                onValueChange={(value) => setEqualizer({...equalizer, treble: value})}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">{equalizer.treble[0]}%</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm">Reset</Button>
            <Button variant="outline" size="sm">Rock</Button>
            <Button variant="outline" size="sm">Pop</Button>
            <Button variant="outline" size="sm">Classical</Button>
            <Button variant="outline" size="sm">Jazz</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioCenter;
