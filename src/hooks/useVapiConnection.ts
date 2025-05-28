
import { useState, useRef, useEffect } from 'react';
import { ScriptLoader } from '@/utils/scriptLoader';

interface UseVapiConnectionProps {
  onComplaintSubmitted: (complaint: any) => void;
}

declare global {
  interface Window {
    Vapi: any;
  }
}

export function useVapiConnection({ onComplaintSubmitted }: UseVapiConnectionProps) {
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

    // Load Vapi SDK with multiple CDN fallbacks
    const loadVapiSDK = async () => {
      const cdnSources = [
        'https://unpkg.com/@vapi-ai/web-sdk@latest/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@vapi-ai/web-sdk@latest/dist/index.js',
        'https://cdn.jsdelivr.net/npm/@vapi-ai/web-sdk@0.5.0/dist/index.js'
      ];

      try {
        console.log('[Vapi] Loading SDK from CDN...');
        await ScriptLoader.loadScript(cdnSources);
        
        if (!window.Vapi) {
          throw new Error('Vapi SDK not available after loading');
        }
        
        console.log('[Vapi] SDK loaded successfully');
        setVapiLoaded(true);
        initializeVapi();
      } catch (error) {
        console.error('[Vapi] Failed to load SDK from all sources:', error);
        setIsSupported(false);
      }
    };

    const initializeVapi = () => {
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

  return {
    isConnected,
    isConnecting,
    transcript,
    response,
    isSupported,
    vapiLoaded,
    toggleConnection
  };
}
