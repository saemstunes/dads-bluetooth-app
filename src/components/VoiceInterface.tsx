
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInterfaceProps {
  isDarkMode: boolean;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ isDarkMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [response, setResponse] = useState('');
  const [waveformData, setWaveformData] = useState(Array(24).fill(0));
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceCommand(transcript);
        
        if (event.results[0].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        setResponse('Sorry, I could not understand that command.');
      };
    }
  }, []);

  // Waveform animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setWaveformData(prev => prev.map(() => Math.random() * 100));
      }, 100);
    } else {
      setWaveformData(Array(24).fill(0));
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Log voice command to database
      await supabase.from('voice_commands').insert({
        command_text: command,
        intent_detected: detectIntent(command),
        confidence_score: 0.9,
        language_code: 'en-US'
      });

      // Process command
      const response = await processCommand(command);
      setResponse(response);

      // Speak response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      setResponse('Sorry, there was an error processing your command.');
    } finally {
      setIsProcessing(false);
    }
  };

  const detectIntent = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('connect') || lowerCommand.includes('pair')) return 'device_connect';
    if (lowerCommand.includes('play') || lowerCommand.includes('music')) return 'audio_control';
    if (lowerCommand.includes('automation') || lowerCommand.includes('rule')) return 'automation_control';
    if (lowerCommand.includes('volume')) return 'volume_control';
    return 'general_query';
  };

  const processCommand = async (command: string): Promise<string> => {
    const intent = detectIntent(command);
    
    switch (intent) {
      case 'device_connect':
        return 'Scanning for nearby devices...';
      case 'audio_control':
        return 'Audio control activated';
      case 'automation_control':
        return 'Automation rules checked';
      case 'volume_control':
        return 'Volume adjusted';
      default:
        return 'Command received and processed';
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceCommand('');
        setResponse('');
      }
    }
  };

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Voice Command Center</h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Press and hold to speak with JARVIS
        </p>
      </div>

      {/* Circular Waveform Visualization */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30"></div>
          <div className="absolute inset-4 rounded-full border border-purple-500/20"></div>
          
          {/* Waveform bars arranged in circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {waveformData.map((height, index) => {
                const angle = (index / waveformData.length) * 360;
                const transform = `rotate(${angle}deg) translateY(-60px)`;
                return (
                  <div
                    key={index}
                    className="absolute w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(height * 0.3, 4)}px`,
                      transform,
                      transformOrigin: 'bottom center',
                      left: '50%',
                      bottom: '50%',
                      marginLeft: '-2px'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Central Voice Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onMouseDown={toggleListening}
              onMouseUp={() => isListening && toggleListening()}
              onTouchStart={toggleListening}
              onTouchEnd={() => isListening && toggleListening()}
              className={`
                w-20 h-20 rounded-full transition-all duration-300 transform hover:scale-105 
                ${isListening
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                }
              `}
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="space-y-3">
        {isListening && (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            <Mic className="h-3 w-3 mr-1" />
            Listening...
          </Badge>
        )}

        {isProcessing && (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            Processing...
          </Badge>
        )}

        {voiceCommand && (
          <div className={`p-3 rounded-lg border max-w-md mx-auto ${
            isDarkMode 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              "{voiceCommand}"
            </p>
          </div>
        )}

        {response && (
          <div className={`p-3 rounded-lg border max-w-md mx-auto ${
            isDarkMode 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              <Volume2 className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                {response}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Voice Commands */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
        {[
          'Connect car',
          'Play music',
          'Check devices',
          'Home mode'
        ].map((command, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleVoiceCommand(command)}
            className={`text-xs h-8 ${
              isDarkMode 
                ? 'border-white/20 hover:bg-white/10' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {command}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VoiceInterface;
