
import React from 'react';

interface VoiceStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  vapiLoaded: boolean;
}

export default function VoiceStatus({ isConnected, isConnecting, vapiLoaded }: VoiceStatusProps) {
  return (
    <div className="text-center">
      <p className={`text-sm font-medium ${
        isConnected ? 'text-red-600' : isConnecting ? 'text-yellow-600' : !vapiLoaded ? 'text-gray-400' : 'text-green-600'
      }`}>
        {!vapiLoaded ? 'Loading...' : isConnected ? 'Connected - Speak now' : isConnecting ? 'Connecting...' : 'Tap to connect'}
      </p>
    </div>
  );
}
