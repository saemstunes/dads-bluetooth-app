
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Brain, 
  Zap,
  MessageSquare,
  Settings,
  VolumeX
} from 'lucide-react';

interface JarvisVoiceAssistantProps {
  isDarkMode: boolean;
  onCommand: (command: string, response: string) => void;
}

interface ConversationContext {
  userPreferences: Record<string, any>;
  carConnected: boolean;
  currentMusic: string | null;
  recentCommands: string[];
}

const JarvisVoiceAssistant: React.FC<JarvisVoiceAssistantProps> = ({ isDarkMode, onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    userPreferences: {},
    carConnected: false,
    currentMusic: null,
    recentCommands: []
  });
  const [waveformData, setWaveformData] = useState(Array(32).fill(0));
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition with enhanced settings
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Enhanced recognition settings
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 3;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentCommand(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          handleAdvancedVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        handleError(`Voice recognition error: ${event.error}`);
      };
    }
  }, []);

  // Advanced waveform animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening || isResponding) {
      interval = setInterval(() => {
        setWaveformData(prev => prev.map((_, index) => {
          const baseHeight = isResponding ? 60 : 40;
          const variation = Math.sin(Date.now() * 0.01 + index * 0.5) * 30;
          return Math.max(5, baseHeight + variation + Math.random() * 20);
        }));
      }, 50);
    } else {
      setWaveformData(Array(32).fill(5));
    }
    return () => clearInterval(interval);
  }, [isListening, isResponding]);

  const handleAdvancedVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        recentCommands: [...prev.recentCommands.slice(-4), command]
      }));

      // Process command with context awareness
      const response = await processIntelligentCommand(command, conversationContext);
      setJarvisResponse(response);
      
      // Speak response using ElevenLabs
      await speakResponse(response);
      
      // Log interaction
      await logVoiceInteraction(command, response);
      
      onCommand(command, response);

    } catch (error) {
      console.error('Error processing voice command:', error);
      handleError('I encountered an error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processIntelligentCommand = async (command: string, context: ConversationContext): Promise<string> => {
    const lowerCommand = command.toLowerCase();
    
    // Context-aware command processing
    if (lowerCommand.includes('connect') && (lowerCommand.includes('car') || lowerCommand.includes('mazda'))) {
      return await handleCarConnection();
    }
    
    if (lowerCommand.includes('play') && lowerCommand.includes('music')) {
      return await handleMusicCommand(lowerCommand);
    }
    
    if (lowerCommand.includes('volume')) {
      return await handleVolumeCommand(lowerCommand);
    }
    
    if (lowerCommand.includes('what') || lowerCommand.includes('status')) {
      return await handleStatusQuery();
    }
    
    if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      return getCapabilitiesResponse();
    }
    
    // Conversational AI fallback
    return await getContextualResponse(command, context);
  };

  const handleCarConnection = async (): Promise<string> => {
    // Simulate car connection logic
    setConversationContext(prev => ({ ...prev, carConnected: true }));
    return "I've initiated the connection to your Mazda CX-5. The Bluetooth audio profile is now active and ready for music streaming.";
  };

  const handleMusicCommand = async (command: string): Promise<string> => {
    if (command.includes('pause') || command.includes('stop')) {
      return "Music paused. Would you like me to resume it later or play something different?";
    }
    if (command.includes('next') || command.includes('skip')) {
      return "Skipping to the next track. This is a great choice for your drive.";
    }
    return "Starting your personalized driving playlist. The audio is now streaming to your Mazda CX-5 system.";
  };

  const handleVolumeCommand = async (command: string): Promise<string> => {
    if (command.includes('up') || command.includes('higher') || command.includes('louder')) {
      return "Volume increased. Is that better for you?";
    }
    if (command.includes('down') || command.includes('lower') || command.includes('quieter')) {
      return "Volume decreased. Let me know if you need any other adjustments.";
    }
    return "Volume adjusted to your preference.";
  };

  const handleStatusQuery = async (): Promise<string> => {
    const connectedDevices = conversationContext.carConnected ? 1 : 0;
    return `System status: ${connectedDevices} device connected, audio streaming ready, and all voice commands are fully operational. How can I assist you today?`;
  };

  const getCapabilitiesResponse = (): string => {
    return "I can help you connect to your car's Bluetooth system, control music playback, adjust volume, check device status, and answer questions about your connected devices. I'm also learning your preferences to provide better assistance over time. What would you like me to help you with?";
  };

  const getContextualResponse = async (command: string, context: ConversationContext): Promise<string> => {
    // This would integrate with a more sophisticated AI service
    const responses = [
      "I understand you'd like help with that. Let me see what I can do for you.",
      "That's an interesting request. Based on your recent activity, I think I can assist you with this.",
      "I'm processing your request with the context of your connected devices and preferences.",
      "Let me help you with that while keeping your car audio system in mind."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakResponse = async (text: string) => {
    if (!elevenlabsApiKey) {
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
      
      setIsResponding(true);
      utterance.onend = () => setIsResponding(false);
      return;
    }

    try {
      setIsResponding(true);
      
      // Use ElevenLabs for premium voice synthesis
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenlabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audio = new Audio(URL.createObjectURL(audioBlob));
        
        audio.onended = () => setIsResponding(false);
        await audio.play();
      } else {
        throw new Error('ElevenLabs API error');
      }
    } catch (error) {
      console.error('TTS Error:', error);
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      utterance.onend = () => setIsResponding(false);
    }
  };

  const logVoiceInteraction = async (command: string, response: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('voice_commands').insert({
          command_text: command,
          response_text: response,
          intent_detected: detectIntent(command),
          confidence_score: 0.95,
          language_code: 'en-US',
          user_id: user.id,
          context_data: JSON.stringify(conversationContext)
        });
      }
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const detectIntent = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('connect') || lowerCommand.includes('pair')) return 'device_connect';
    if (lowerCommand.includes('play') || lowerCommand.includes('music')) return 'audio_control';
    if (lowerCommand.includes('volume')) return 'volume_control';
    if (lowerCommand.includes('status') || lowerCommand.includes('what')) return 'status_query';
    if (lowerCommand.includes('help')) return 'help_request';
    return 'general_conversation';
  };

  const handleError = (errorMessage: string) => {
    toast({
      title: "Voice Assistant Error",
      description: errorMessage,
      variant: "destructive",
      className: `${isDarkMode ? 'bg-red-900/80 border-red-700 text-red-200' : 'bg-red-50 border-red-300 text-red-800'} backdrop-blur-md`
    });
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setCurrentCommand('');
        setJarvisResponse('');
      }
    }
  };

  return (
    <Card className={`p-6 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-white/5 border-white/10 hover:bg-white/8' 
        : 'bg-white/90 border-gray-200/50 hover:bg-white/95'
    } backdrop-blur-md rounded-3xl shadow-2xl`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            {(isListening || isProcessing || isResponding) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            JARVIS Voice Assistant
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {!elevenlabsApiKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const key = prompt('Enter your ElevenLabs API key for premium voice:');
                if (key) setElevenlabsApiKey(key);
              }}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Premium Voice
            </Button>
          )}
          
          <Badge variant={isListening ? 'default' : 'secondary'} className="text-sm">
            {isListening ? 'Listening' : 'Ready'}
          </Badge>
        </div>
      </div>

      {/* Circular Waveform Visualization */}
      <div className="flex justify-center mb-6">
        <div className="relative w-56 h-56">
          {/* Outer rings */}
          <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            isListening ? 'border-blue-500/50 animate-pulse scale-105' : 'border-blue-500/20'
          }`}></div>
          <div className={`absolute inset-6 rounded-full border transition-all duration-500 ${
            isResponding ? 'border-green-500/40 animate-pulse' : 'border-purple-500/20'
          }`}></div>
          
          {/* Advanced Waveform */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40">
              {waveformData.map((height, index) => {
                const angle = (index / waveformData.length) * 360;
                const radius = 70;
                const barHeight = Math.max(height * 0.4, 8);
                const color = isResponding ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-purple-500';
                
                return (
                  <div
                    key={index}
                    className={`absolute w-1.5 bg-gradient-to-t ${color} rounded-full transition-all duration-75`}
                    style={{
                      height: `${barHeight}px`,
                      transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                      transformOrigin: `center ${radius}px`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-3px',
                      marginTop: `-${radius}px`
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
                w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl
                ${isListening
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse hover:bg-red-600'
                  : isProcessing
                    ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-spin hover:bg-yellow-600'
                    : isResponding
                      ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse hover:bg-green-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
                }
              `}
            >
              {isListening ? (
                <MicOff className="h-8 w-8 text-white" />
              ) :  isProcessing ? (
                <Zap className="h-8 w-8 text-white" />
              ) : isResponding ? (
                <Volume2 className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <div className="space-y-4">
        {currentCommand && (
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-blue-500/10 border-blue-500/30 backdrop-blur-md' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start space-x-2">
              <MessageSquare className={`h-4 w-4 mt-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                "{currentCommand}"
              </p>
            </div>
          </div>
        )}

        {jarvisResponse && (
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-green-500/10 border-green-500/30 backdrop-blur-md' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start space-x-2">
              <Brain className={`h-4 w-4 mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                {jarvisResponse}
              </p>
            </div>
          </div>
        )}

        {(isProcessing || isResponding) && (
          <div className="flex justify-center">
            <Badge variant="outline" className={`${
              isDarkMode 
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' 
                : 'bg-yellow-100 text-yellow-800 border-yellow-300'
            } animate-pulse backdrop-blur-md`}>
              {isProcessing ? 'Processing...' : 'Speaking...'}
            </Badge>
          </div>
        )}
      </div>

      {/* Quick Commands */}
      <div className="grid grid-cols-2 gap-2 mt-6">
        {[
          'Connect to car',
          'Play my music',
          'What\'s my status?',
          'Help me navigate'
        ].map((command, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleAdvancedVoiceCommand(command)}
            className={`text-xs h-9 transition-all duration-300 hover:scale-105 transform rounded-full ${
              isDarkMode 
                ? 'border-white/20 hover:bg-white/10 hover:border-white/30 text-gray-300' 
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
            }`}
          >
            {command}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default JarvisVoiceAssistant;
