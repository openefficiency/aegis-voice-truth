
import React from 'react';
import { useVapiConnection } from '@/hooks/useVapiConnection';
import VoiceButton from '@/components/VoiceButton';
import VoiceTranscript from '@/components/VoiceTranscript';
import VoiceResponse from '@/components/VoiceResponse';
import VoiceStatus from '@/components/VoiceStatus';

interface WebSpeechVoiceWidgetProps {
  onComplaintSubmitted: (complaint: any) => void;
}

export default function WebSpeechVoiceWidget({ onComplaintSubmitted }: WebSpeechVoiceWidgetProps) {
  const {
    isConnected,
    isConnecting,
    transcript,
    response,
    isSupported,
    vapiLoaded,
    toggleConnection
  } = useVapiConnection({ onComplaintSubmitted });

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

      <VoiceButton
        isConnected={isConnected}
        isConnecting={isConnecting}
        vapiLoaded={vapiLoaded}
        onClick={toggleConnection}
      />

      <VoiceStatus
        isConnected={isConnected}
        isConnecting={isConnecting}
        vapiLoaded={vapiLoaded}
      />

      <VoiceTranscript transcript={transcript} />

      <VoiceResponse response={response} />

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
