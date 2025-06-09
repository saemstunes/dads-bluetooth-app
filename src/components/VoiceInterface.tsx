
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Volume2, Bluetooth } from 'lucide-react';

interface VoiceInterfaceProps {
  onExitVoiceMode: () => void;
  connectedDevices: Array<{
    id: number;
    name: string;
    type: string;
    status: string;
    signal: number;
  }>;
  currentTrack: {
    title: string;
    artist: string;
    isPlaying: boolean;
  };
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onExitVoiceMode, 
  connectedDevices, 
  currentTrack 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [waveformHeight, setWaveformHeight] = useState(50);
  const recognitionRef = useRef<any>(null);

  // Simulated voice commands
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('connect') && lowerCommand.includes('car')) {
      setResponse('Connecting to car audio system...');
      setTimeout(() => setResponse('Successfully connected to car audio'), 1500);
    } else if (lowerCommand.includes('play music') || lowerCommand.includes('play')) {
      setResponse('Starting music playback...');
      setTimeout(() => setResponse('Now playing your favorite playlist'), 1500);
    } else if (lowerCommand.includes('volume up')) {
      setResponse('Volume increased to 80%');
    } else if (lowerCommand.includes('volume down')) {
      setResponse('Volume decreased to 60%');
    } else if (lowerCommand.includes('devices') || lowerCommand.includes('connected')) {
      const connected = connectedDevices.filter(d => d.status === 'connected');
      setResponse(`${connected.length} devices connected: ${connected.map(d => d.name).join(', ')}`);
    } else if (lowerCommand.includes('what') && lowerCommand.includes('playing')) {
      setResponse(`Currently playing: ${currentTrack.title} by ${currentTrack.artist}`);
    } else {
      setResponse('Command not recognized. Try saying "connect to car", "play music", or "what\'s playing"');
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
    
    // Simulated speech recognition
    setTimeout(() => {
      const sampleCommands = [
        'Connect to car audio',
        'Play music',
        'What\'s currently playing',
        'Volume up',
        'Show connected devices'
      ];
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      setTranscript(randomCommand);
      handleVoiceCommand(randomCommand);
      setIsListening(false);
    }, 2000);
  };

  // Animated waveform effect
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setWaveformHeight(Math.random() * 80 + 20);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          JARVIS
        </h1>
        <p className="text-xl text-blue-200">Voice Assistant Mode</p>
        <Badge variant="outline" className="text-blue-300 border-blue-300">
          Push to Talk Active
        </Badge>
      </div>

      {/* Voice Visualization */}
      <Card className="bg-black/30 backdrop-blur-lg border-blue-500/30">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Waveform Animation */}
            <div className="flex justify-center items-end space-x-1 h-24">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-100 ${
                    isListening ? 'animate-pulse' : ''
                  }`}
                  style={{
                    height: isListening ? `${Math.random() * 60 + 20}px` : '20px'
                  }}
                />
              ))}
            </div>

            {/* Status Text */}
            <div className="space-y-2">
              {isListening && (
                <p className="text-blue-300 animate-pulse">Listening...</p>
              )}
              {transcript && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">You said:</p>
                  <p className="text-lg text-white font-medium">"{transcript}"</p>
                </div>
              )}
              {response && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">JARVIS:</p>
                  <p className="text-lg text-blue-300">{response}</p>
                </div>
              )}
            </div>

            {/* Push to Talk Button */}
            <Button
              onMouseDown={startListening}
              disabled={isListening}
              size="lg"
              className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-xl"
            >
              {isListening ? (
                <div className="animate-pulse">●</div>
              ) : (
                <Volume2 className="h-8 w-8" />
              )}
            </Button>
            <p className="text-sm text-gray-400">Hold to speak</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-black/30 backdrop-blur-lg border-green-500/30">
          <CardContent className="p-4 text-center">
            <Bluetooth className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <p className="text-green-400 font-bold text-xl">
              {connectedDevices.filter(d => d.status === 'connected').length}
            </p>
            <p className="text-sm text-gray-400">Connected</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Volume2 className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <p className="text-purple-400 font-bold text-xl">
              {currentTrack.isPlaying ? 'Playing' : 'Paused'}
            </p>
            <p className="text-sm text-gray-400">Audio Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Exit Button */}
      <div className="text-center">
        <Button 
          onClick={onExitVoiceMode}
          variant="outline"
          className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
        >
          Exit Voice Mode
        </Button>
      </div>
    </div>
  );
};

export default VoiceInterface;
