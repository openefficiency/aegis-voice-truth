
// Stat cards for: open, resolved, reward issued, bounty (mocked)

import React from "react";
import { CheckCircle, Gift, DollarSign, Shield } from "lucide-react";

export default function DashboardStats({ complaints }) {
  const open = complaints.filter(c => c.status === "open").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const rewards = complaints.filter(c => c.rewarded).length;
  const bounty = "$1000"; // Placeholder

  const statList = [
    { label: "Open Cases", count: open, icon: <Shield className="text-blue-600" /> },
    { label: "Resolved", count: resolved, icon: <CheckCircle className="text-green-600" /> },
    { label: "Rewards Issued", count: rewards, icon: <Gift className="text-yellow-700" /> },
    { label: "Bounty Open", count: bounty, icon: <DollarSign className="text-purple-700" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statList.map(s =>
        <div key={s.label} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-gray-100">
          {s.icon}
          <span className="text-2xl font-extrabold mt-2">{s.count}</span>
          <span className="text-xs mt-1 text-gray-500">{s.label}</span>
        </div>
      )}
    </div>
  );
}
