
import React from "react";

export default function CaseAuditTrail({ trail }) {
  if (!trail || !trail.length) {
    return (
      <div className="bg-gray-50 border rounded p-4 mt-2 text-gray-400">
        No audit trail yet.
      </div>
    );
  }
  return (
    <div className="bg-gray-50 border rounded p-4 mt-2">
      <h3 className="text-lg font-semibold mb-2">Audit Trail</h3>
      <ul className="list-none space-y-1">
        {trail.map((item, idx) => (
          <li key={idx} className="text-gray-700">
            <b>[{item.timestamp}]</b> {item.action}
          </li>
        ))}
      </ul>
    </div>
  );
}
