
import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, AlertCircle, Mic } from "lucide-react";

interface VoiceReportWidgetProps {
  onComplaintSubmitted: (complaint: any) => void;
}

export default function VoiceReportWidget({ onComplaintSubmitted }: VoiceReportWidgetProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      console.log('[VAPI Widget] Received message:', event.data);
      
      if (event.data?.type === 'vapi-ready') {
        console.log('[VAPI Widget] Vapi iframe is ready');
        setIsReady(true);
        setError(null);
      } else if (event.data?.type === 'vapi-complaint') {
        console.log('[VAPI Widget] Received complaint data:', event.data);
        
        // Submit the complaint with the received data
        onComplaintSubmitted({
          summary: event.data.summary || 'Voice complaint submitted',
          transcript: event.data.transcript || '',
          category: event.data.category || 'general',
          audioUrl: null, // We don't store the actual audio for privacy
          timestamp: new Date().toLocaleString()
        });
      } else if (event.data?.type === 'vapi-error') {
        console.error('[VAPI Widget] Error from iframe:', event.data.error);
        setError(event.data.error);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplaintSubmitted]);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 px-4 py-6 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="text-red-700 text-lg font-medium">Voice Service Error</span>
        <span className="text-red-600 text-sm text-center">{error}</span>
        <button 
          onClick={() => {
            setError(null);
            setIsReady(false);
            if (iframeRef.current) {
              iframeRef.current.src = iframeRef.current.src; // Reload iframe
            }
          }}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 px-4 py-6 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-blue-600 animate-pulse" />
          <span className="text-blue-700 text-lg font-medium">Loading Voice Service...</span>
        </div>
        <div className="text-blue-600 text-sm">Initializing secure voice reporting...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4 px-4 py-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Anonymous Voice Reporting</h3>
        <p className="text-sm text-gray-600">Speak confidentially about your concerns</p>
      </div>
      
      <iframe
        ref={iframeRef}
        src="/vapi-iframe.html"
        title="Vapi Voice Interface"
        className="w-full max-w-md h-80 border-0 rounded-xl shadow-md bg-white"
        allow="microphone"
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
      
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Secure & Anonymous</span>
        </div>
        <div className="text-xs text-gray-500 max-w-sm">
          Your voice is processed securely. We only keep the text summary, never the audio recording.
        </div>
      </div>
    </div>
  );
}
