
import React from 'react';
import { Volume2 } from 'lucide-react';

interface VoiceResponseProps {
  response: string;
}

export default function VoiceResponse({ response }: VoiceResponseProps) {
  if (!response) return null;

  return (
    <div className="w-full max-w-md">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Assistant:</span>
        </div>
        <p className="text-sm text-blue-800">{response}</p>
      </div>
    </div>
  );
}
