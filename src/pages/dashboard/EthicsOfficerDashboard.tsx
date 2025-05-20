import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import ComplaintList from "./ComplaintList";

import { User, Check, Award } from "lucide-react";

const dummyOfficer = {
  username: "ethics@aegiswhistle.com",
  password: "Ethics123!",
};

export default function EthicsOfficerDashboard({
  complaints,
  assignCase,
  showControls = true,
  onResolve,
  onEscalate,
  onReward,
  role,
  currentUsername,
  onUpdateNote
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Open Cases" value={complaints.filter(c => c.status === 'open').length} icon={User} />
        <StatCard title="Resolved" value={complaints.filter(c => c.status === 'resolved').length} icon={Check} />
        <StatCard title="Rewards" value={complaints.filter(c => !!c.rewarded).length} icon={Award} />
      </div>
      <ComplaintList
        complaints={complaints}
        assignCase={assignCase}
        showControls={showControls}
        onResolve={onResolve}
        onEscalate={onEscalate}
        onReward={onReward}
        role={role}
        currentUsername={currentUsername}
        onUpdateNote={onUpdateNote}
      />
    </div>
  );
}
