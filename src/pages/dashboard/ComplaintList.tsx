
import React, { useState } from "react";
import ComplaintSummaryCard from "./ComplaintSummaryCard";

export default function ComplaintList({
  complaints,
  assignCase,
  showControls = false,
  onResolve,
  onEscalate,
  onReward,
  role,
  currentUsername,
  onUpdateNote,
}) {
  if (!complaints || complaints.length === 0)
    return (
      <div className="text-gray-400 font-semibold mt-8 text-center">
        No complaints to display.
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {complaints.map((complaint) => (
        <ComplaintSummaryCard
          key={complaint.id}
          complaint={complaint}
          assignCase={assignCase}
          showControls={showControls}
          onResolve={onResolve}
          onEscalate={onEscalate}
          onReward={onReward}
          role={role}
          currentUsername={currentUsername}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </div>
  );
}
