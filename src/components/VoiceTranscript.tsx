
import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceTranscriptProps {
  transcript: string;
}

export default function VoiceTranscript({ transcript }: VoiceTranscriptProps) {
  if (!transcript) return null;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-start gap-2 mb-2">
          <Mic className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">You said:</span>
        </div>
        <p className="text-sm text-gray-800">{transcript}</p>
      </div>
    </div>
  );
}
