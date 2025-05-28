
import React from "react";
import WebSpeechVoiceWidget from "@/components/WebSpeechVoiceWidget";
import { Button } from "@/components/ui/button";

interface ReportSectionProps {
  onWrite: () => void;
  ackCode: string;
  handleComplaintSubmitted: (complaint: any) => void;
}

export default function ReportSection({ onWrite, ackCode, handleComplaintSubmitted }: ReportSectionProps) {
  return (
    <main className="flex-1 flex flex-col justify-center items-center px-2">
      <section className="max-w-lg w-full my-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-900">
          Whistleblowing. Made Effortless.
        </h1>
        <WebSpeechVoiceWidget onComplaintSubmitted={handleComplaintSubmitted} />
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-500 bg-gray-50 px-2">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onWrite}
        >
          Submit by Writing Instead
        </Button>
      </section>
      {ackCode && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center">
          <span className="text-green-700 font-bold">
            Your Report Code:
          </span>
          <span className="text-lg font-mono tracking-wide text-green-600">
            {ackCode}
          </span>
          <span className="text-xs text-gray-400 mt-2">
            Save this code to check status or reward updates!
          </span>
        </div>
      )}
    </main>
  );
}
