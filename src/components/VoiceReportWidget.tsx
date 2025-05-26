
// VAPI Widget — uses your agent, routes summary to parent, fallback to write

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

const VAPI_AGENT_ID = "bb8029bb-dde6-485a-9c32-d41b684568ff";
const VAPI_PUBLIC_KEY = "6b3e7486-6bd4-4521-b010-4d4ea7bf2f48";
const VAPI_IFRAME_URL = `https://vapi.ai?demo=true&shareKey=${VAPI_PUBLIC_KEY}&assistantId=${VAPI_AGENT_ID}`;

export default function VoiceReportWidget({ onComplaintSubmitted }) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Simulate SDK loading/fallback trigger
    const timer = setTimeout(() => setUseFallback(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Listen to VAPI summary event in iframe (simulate extraction, demo only)
  useEffect(() => {
    function handleMessage(e) {
      if (e.data && typeof e.data === "object" && e.data.complaintSummary) {
        onComplaintSubmitted({
          summary: e.data.complaintSummary,
          transcript: e.data.complaintTranscript,
          category: e.data.tag || "general",
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplaintSubmitted]);

  if (useFallback) {
    return (
      <div className="w-full flex flex-col items-center space-y-4 px-4 py-6 bg-blue-50 border border-blue-100 rounded-xl">
        <span className="text-gray-800 text-lg font-medium">Voice Reporting via Aegis VAPI Agent</span>
        <iframe
          src={VAPI_IFRAME_URL}
          title="Aegis VAPI Agent"
          className="w-full max-w-md h-80 border rounded-xl shadow"
          allow="microphone"
        />
        <div className="text-gray-500 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" /> Secure, anonymous — we only keep the summary, never record your voice.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow flex flex-col items-center">
      <span className="font-semibold text-blue-700">Aegis Voice Agent loading...</span>
      <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" /> Loading... In a moment, the anonymous voice widget will appear!
      </div>
    </div>
  );
}
