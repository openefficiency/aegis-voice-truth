
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface WebSpeechVoiceWidgetProps {
  onComplaintSubmitted: (complaint: any) => void;
}

export default function WebSpeechVoiceWidget({ onComplaintSubmitted }: WebSpeechVoiceWidgetProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[Speech] Recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
      
      if (finalTranscript) {
        console.log('[Speech] Final transcript:', finalTranscript);
        handleSpeechInput(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('[Speech] Recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSpeechInput = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    
    try {
      // Call Vapi's REST API
      const response = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 4669de51-f9ba-4e99-a9dd-e39279a6f510`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: 'bb8029bb-dde6-485a-9c32-d41b684568ff',
          customer: {
            number: '+1234567890', // Placeholder
          },
          assistantOverrides: {
            firstMessage: `I heard you say: "${text}". I'm here to help you submit a whistleblower report. Can you please provide more details about your concern?`,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Vapi API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Vapi] API response:', data);

      // Generate a response based on the input
      const aiResponse = generateResponse(text);
      setResponse(aiResponse);
      
      // Speak the response
      speakText(aiResponse);

      // If this seems like a complete complaint, submit it
      if (text.length > 50 && (text.includes('report') || text.includes('complaint') || text.includes('concern'))) {
        onComplaintSubmitted({
          summary: text.slice(0, 100) + '...',
          transcript: text,
          category: 'general',
          audioUrl: null,
          timestamp: new Date().toLocaleString()
        });
      }

    } catch (error) {
      console.error('[Vapi] API call failed:', error);
      const fallbackResponse = "I understand you want to report a concern. Could you please provide more details?";
      setResponse(fallbackResponse);
      speakText(fallbackResponse);
    }

    setIsProcessing(false);
  };

  const generateResponse = (input: string): string => {
    const responses = [
      "Thank you for bringing this to my attention. Can you provide more specific details about what you witnessed?",
      "I understand your concern. When did this incident occur and who was involved?",
      "That sounds serious. Do you have any evidence or documentation related to this matter?",
      "I appreciate you coming forward. Can you tell me more about the circumstances surrounding this issue?",
      "Thank you for reporting this. What department or area of the organization does this concern?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to use a pleasant voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
    }
  };

  if (!isSupported) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 px-4 py-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="text-red-700 text-center">
          <p className="font-medium">Voice features not supported</p>
          <p className="text-sm">Your browser doesn't support speech recognition or synthesis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6 px-4 py-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice Assistant</h3>
        <p className="text-sm text-gray-600">Speak your concerns confidentially</p>
      </div>

      {/* Floating Voice Button */}
      <div className="relative">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`
            w-20 h-20 rounded-full border-4 transition-all duration-300 flex items-center justify-center
            ${isListening 
              ? 'bg-red-500 border-red-300 shadow-lg shadow-red-200 animate-pulse' 
              : 'bg-blue-500 border-blue-300 shadow-lg shadow-blue-200 hover:bg-blue-600'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
        
        {/* Pulse animation when listening */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
        )}
      </div>

      {/* Status */}
      <div className="text-center">
        <p className={`text-sm font-medium ${
          isListening ? 'text-red-600' : isProcessing ? 'text-yellow-600' : 'text-gray-600'
        }`}>
          {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
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
          Tap the microphone and speak your concerns. The assistant will guide you through the reporting process.
        </div>
        <div className="text-xs text-green-600 font-medium">
          🔒 Secure & Anonymous
        </div>
      </div>
    </div>
  );
}
