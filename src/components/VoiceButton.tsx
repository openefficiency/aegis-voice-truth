
import React from 'react';
import { Phone, PhoneOff } from 'lucide-react';

interface VoiceButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  vapiLoaded: boolean;
  onClick: () => void;
}

export default function VoiceButton({ isConnected, isConnecting, vapiLoaded, onClick }: VoiceButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
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
  );
}
