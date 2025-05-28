
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Phone, PhoneOff } from 'lucide-react';

interface WebSpeechVoiceWidgetProps {
  onComplaintSubmitted: (complaint: any) => void;
}

declare global {
  interface Window {
    Vapi: any;
  }
}

export default function WebSpeechVoiceWidget({ onComplaintSubmitted }: WebSpeechVoiceWidgetProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [vapiLoaded, setVapiLoaded] = useState(false);
  
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const checkSupport = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition || !window.speechSynthesis) {
        setIsSupported(false);
        return false;
      }
      return true;
    };

    if (!checkSupport()) return;

    // Load Vapi SDK
    const loadVapiSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web-sdk@latest/dist/index.js';
      script.onload = () => {
        console.log('[Vapi] SDK loaded successfully');
        setVapiLoaded(true);
        initializeVapi();
      };
      script.onerror = () => {
        console.error('[Vapi] Failed to load SDK');
        setIsSupported(false);
      };
      document.head.appendChild(script);
    };

    const initializeVapi = () => {
      if (!window.Vapi) {
        console.error('[Vapi] SDK not available');
        return;
      }

      try {
        vapiRef.current = new window.Vapi('4669de51-f9ba-4e99-a9dd-e39279a6f510');
        
        // Set up event listeners
        vapiRef.current.on('call-start', () => {
          console.log('[Vapi] Call started');
          setIsConnected(true);
          setIsConnecting(false);
          setResponse('Connected! I\'m listening to your concerns...');
        });

        vapiRef.current.on('call-end', () => {
          console.log('[Vapi] Call ended');
          setIsConnected(false);
          setIsConnecting(false);
          setResponse('Call ended. Thank you for your report.');
        });

        vapiRef.current.on('speech-start', () => {
          console.log('[Vapi] User started speaking');
          setTranscript('Listening...');
        });

        vapiRef.current.on('speech-end', () => {
          console.log('[Vapi] User stopped speaking');
        });

        vapiRef.current.on('message', (message: any) => {
          console.log('[Vapi] Message received:', message);
          
          if (message.type === 'transcript') {
            if (message.transcriptType === 'partial') {
              setTranscript(message.transcript);
            } else if (message.transcriptType === 'final') {
              setTranscript(message.transcript);
              // Check if this seems like a complete complaint
              if (message.transcript && message.transcript.length > 50) {
                setTimeout(() => {
                  onComplaintSubmitted({
                    summary: message.transcript.slice(0, 100) + '...',
                    transcript: message.transcript,
                    category: 'voice-report',
                    audioUrl: null,
                    timestamp: new Date().toLocaleString(),
                    source: 'vapi-voice'
                  });
                }, 2000);
              }
            }
          }

          if (message.type === 'function-call') {
            console.log('[Vapi] Function call:', message);
          }
        });

        vapiRef.current.on('error', (error: any) => {
          console.error('[Vapi] Error:', error);
          setIsConnected(false);
          setIsConnecting(false);
          setResponse('Connection error. Please try again.');
        });

        console.log('[Vapi] Initialized successfully');
      } catch (error) {
        console.error('[Vapi] Initialization error:', error);
        setIsSupported(false);
      }
    };

    loadVapiSDK();

    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (error) {
          console.error('[Vapi] Cleanup error:', error);
        }
      }
    };
  }, [onComplaintSubmitted]);

  const toggleConnection = async () => {
    if (!vapiRef.current || !vapiLoaded) {
      console.error('[Vapi] SDK not ready');
      return;
    }

    if (isConnected) {
      try {
        vapiRef.current.stop();
        setIsConnected(false);
        setResponse('');
        setTranscript('');
      } catch (error) {
        console.error('[Vapi] Error stopping call:', error);
      }
    } else {
      setIsConnecting(true);
      try {
        await vapiRef.current.start('bb8029bb-dde6-485a-9c32-d41b684568ff');
        console.log('[Vapi] Starting call with assistant...');
      } catch (error) {
        console.error('[Vapi] Error starting call:', error);
        setIsConnecting(false);
        setResponse('Failed to connect. Please check your microphone permissions and try again.');
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 px-4 py-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="text-red-700 text-center">
          <p className="font-medium">Voice features not supported</p>
          <p className="text-sm">Your browser doesn't support the required voice features or Vapi SDK failed to load.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6 px-4 py-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Voice Assistant</h3>
        <p className="text-sm text-gray-600">Connect and speak your concerns confidentially</p>
      </div>

      {/* Floating Voice Button */}
      <div className="relative">
        <button
          onClick={toggleConnection}
          disabled={isConnecting || !vapiLoaded}
          className={`
            w-20 h-20 rounded-full border-4 transition-all duration-300 flex items-center justify-center
            ${isConnected 
              ? 'bg-red-500 border-red-300 shadow-lg shadow-red-200 animate-pulse' 
              : 'bg-green-500 border-green-300 shadow-lg shadow-green-200 hover:bg-green-600'
            }
            ${isConnecting || !vapiLoaded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          {isConnecting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isConnected ? (
            <PhoneOff className="w-8 h-8 text-white" />
          ) : (
            <Phone className="w-8 h-8 text-white" />
          )}
        </button>
        
        {/* Pulse animation when connected */}
        {isConnected && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
        )}
      </div>

      {/* Status */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          isConnected ? 'text-red-600' : isConnecting ? 'text-yellow-600' : !vapiLoaded ? 'text-gray-400' : 'text-green-600'
        }`}>
          {!vapiLoaded ? 'Loading...' : isConnected ? 'Connected - Speak now' : isConnecting ? 'Connecting...' : 'Tap to connect'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="w-full max-w-md">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-start gap-2 mb-2">
              <Mic className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">You said:</span>
            </div>
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="w-full max-w-md">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Assistant:</span>
            </div>
            <p className="text-sm text-blue-800">{response}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center space-y-2 max-w-sm">
        <div className="text-xs text-gray-500">
          {vapiLoaded 
            ? "Tap the button to connect to our AI assistant. Speak your concerns and the assistant will guide you through the reporting process."
            : "Loading voice assistant..."
          }
        </div>
        <div className="text-xs text-green-600 font-medium">
          🔒 Secure & Anonymous
        </div>
      </div>
    </div>
  );
}
