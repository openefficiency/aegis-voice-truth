import React from "react";
import ComplaintList from "./ComplaintList";
import StatCard from "@/components/StatCard";
import { User, Folder } from "lucide-react";

const dummyInvestigator = {
  username: "investigator@aegiswhistle.com",
  password: "Investigate456!",
};

export default function InvestigatorDashboard({
  complaints,
  showControls = false,
  role,
  onUpdateNote,
  currentUsername,
  assignCase,
  onResolve,
  onEscalate,
  onReward
}) {
  const myCases = complaints.filter(
    c => (c.assignedTo && c.assignedTo === currentUsername)
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="My Open Cases" value={myCases.filter(c=>c.status==='open').length} icon={Folder}/>
        <StatCard title="Total Assigned" value={myCases.length} icon={User}/>
      </div>
      <ComplaintList
        complaints={myCases}
        assignCase={assignCase}
        showControls={showControls}
        role={role}
        onUpdateNote={onUpdateNote}
        currentUsername={currentUsername}
        onResolve={onResolve}
        onEscalate={onEscalate}
        onReward={onReward}
      />
    </div>
  );
}
