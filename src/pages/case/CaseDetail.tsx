
import React from "react";
import CaseNotes from "./CaseNotes";
import CaseAuditTrail from "./CaseAuditTrail";
import CaseEvidenceUploader from "./CaseEvidenceUploader";

// Dummy data - in a real app, fetch by case ID
export default function CaseDetail({ complaint, auditTrail, onAddNote, onUploadEvidence }) {
  if (!complaint) {
    return <div className="text-red-500 font-bold">Case not found</div>;
  }

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-1">Case #{complaint.id}: {complaint.category}</h2>
        <div className="text-gray-700 text-base">{complaint.summary}</div>
        {complaint.audioUrl && (
          <audio controls src={complaint.audioUrl} className="mt-3 mb-2">
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <CaseNotes notes={complaint.notes} onAddNote={onAddNote} />
      <CaseEvidenceUploader onUpload={onUploadEvidence} />
      <CaseAuditTrail trail={auditTrail} />
    </div>
  );
}
