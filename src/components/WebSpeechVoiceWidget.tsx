
import React, { useEffect, useRef } from 'react';
import '@/components/VapiWebComponent';

interface WebSpeechVoiceWidgetProps {
  onComplaintSubmitted: (complaint: any) => void;
}

export default function WebSpeechVoiceWidget({ onComplaintSubmitted }: WebSpeechVoiceWidgetProps) {
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const vapiElement = vapiRef.current;
    if (!vapiElement) return;

    const handleVapiReady = () => {
      console.log('Vapi is ready');
    };

    const handleCallStart = () => {
      console.log('Call started');
    };

    const handleCallEnd = () => {
      console.log('Call ended');
    };

    const handleTranscript = (event: CustomEvent) => {
      const transcript = event.detail.transcript;
      console.log('Transcript received:', transcript);
      
      // Auto-submit if transcript looks like a complete complaint
      if (transcript && transcript.length > 50) {
        setTimeout(() => {
          onComplaintSubmitted({
            summary: transcript.slice(0, 100) + '...',
            transcript: transcript,
            category: 'voice-report',
            audioUrl: null,
            timestamp: new Date().toLocaleString(),
            source: 'vapi-voice'
          });
        }, 2000);
      }
    };

    const handleError = (event: CustomEvent) => {
      console.error('Vapi error:', event.detail);
    };

    // Add event listeners
    vapiElement.addEventListener('vapi-ready', handleVapiReady);
    vapiElement.addEventListener('vapi-call-start', handleCallStart);
    vapiElement.addEventListener('vapi-call-end', handleCallEnd);
    vapiElement.addEventListener('vapi-transcript', handleTranscript);
    vapiElement.addEventListener('vapi-error', handleError);

    return () => {
      // Cleanup event listeners
      vapiElement.removeEventListener('vapi-ready', handleVapiReady);
      vapiElement.removeEventListener('vapi-call-start', handleCallStart);
      vapiElement.removeEventListener('vapi-call-end', handleCallEnd);
      vapiElement.removeEventListener('vapi-transcript', handleTranscript);
      vapiElement.removeEventListener('vapi-error', handleError);
    };
  }, [onComplaintSubmitted]);

  return (
    <div className="w-full flex flex-col items-center space-y-6 px-4 py-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Voice Assistant</h3>
        <p className="text-sm text-gray-600">Connect and speak your concerns confidentially</p>
      </div>

      <vapi-voice-chat 
        ref={vapiRef}
        public-key="4669de51-f9ba-4e99-a9dd-e39279a6f510"
        assistant-id="bb8029bb-dde6-485a-9c32-d41b684568ff"
      />

      <div className="text-center space-y-2 max-w-sm">
        <div className="text-xs text-gray-500">
          Tap the button to connect to our AI assistant. Speak your concerns and the assistant will guide you through the reporting process.
        </div>
        <div className="text-xs text-green-600 font-medium">
          🔒 Secure & Anonymous
        </div>
      </div>
    </div>
  );
}
