
import React, { useState } from "react";
import { User, PlayCircle, Paperclip, MessageSquare, Check, Shield } from "lucide-react";

const testInvestigators = [
  { username: "investigator@aegiswhistle.com" }
];

export default function ComplaintSummaryCard({
  complaint,
  assignCase,
  showControls = false,
  onResolve,
  onEscalate,
  onReward,
  role,
  currentUsername,
  onUpdateNote,
}) {
  const [note, setNote] = useState(complaint.notes || "");

  // For demonstration, show transcript and audio (simulated).
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Shield className="text-blue-500 w-5 h-5" />
          <span className="font-semibold text-gray-800">Complaint #{complaint.id}</span>
          <span className="ml-2 text-sm px-2 py-0.5 rounded bg-blue-50 text-blue-700">{complaint.category}</span>
        </div>
        <span className="text-xs text-gray-400">{complaint.timestamp}</span>
      </div>

      <div className="text-gray-700 mt-1 text-base">{complaint.summary}</div>
      {complaint.transcript && (
        <details className="text-gray-500 text-xs mt-1">
          <summary className="cursor-pointer">View full transcript</summary>
          <div className="mt-1 whitespace-pre-wrap">{complaint.transcript}</div>
        </details>
      )}
      {complaint.audioUrl && (
        <audio controls src={complaint.audioUrl} className="mt-2">
          Your browser does not support the audio element.
        </audio>
      )}
      {/* Ethics officer controls for assignment/reward */}
      {showControls && (
        <div className="flex gap-3 mt-2">
          <select
            className="border rounded px-2 py-1"
            value={complaint.assignedTo || ""}
            onChange={e => assignCase(complaint.id, e.target.value)}
          >
            <option value="">Assign to Investigator</option>
            {testInvestigators.map(inv =>
              <option value={inv.username} key={inv.username}>{inv.username}</option>
            )}
          </select>
          <button
            className="bg-green-100 hover:bg-green-200 text-green-900 px-3 py-1 rounded"
            onClick={() => onResolve?.(complaint.id)}
            disabled={complaint.status === "resolved"}
          >
            <Check className="w-4 h-4 inline" /> Mark Resolved
          </button>
          <button
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 px-3 py-1 rounded"
            onClick={() => onEscalate?.(complaint.id)}
          >
            Escalate
          </button>
          <button
            className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-3 py-1 rounded"
            onClick={() => onReward?.(complaint.id)}
            disabled={complaint.rewarded}
          >
            <Shield className="w-4 h-4 inline" /> Reward
          </button>
        </div>
      )}

      {/* Investigator controls for adding a note */}
      {role === "investigator" && complaint.status !== "resolved" && (
        <div className="flex flex-col mt-2">
          <textarea
            className="border p-2 rounded mb-2"
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add investigation update/note (visible to audit trail)"
          />
          <button
            className="self-end bg-blue-500 text-white text-sm rounded px-3 py-1"
            onClick={() => onUpdateNote?.(complaint.id, note)}
            disabled={note === complaint.notes}
          >
            <MessageSquare className="w-3 h-3 inline mr-1" /> Post Update
          </button>
        </div>
      )}

      {/* Status Flags */}
      <div className="flex gap-2 mt-2 items-center text-xs">
        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">Status: <b>{complaint.status}</b></span>
        {complaint.assignedTo && (
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">Assigned to: {complaint.assignedTo}</span>
        )}
        {complaint.rewarded && (
          <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">Rewarded</span>
        )}
      </div>
    </div>
  );
}
