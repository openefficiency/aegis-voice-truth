
import React from "react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface VapiDashboardProps {
  complaints: any[];
  onBack?: () => void;
}
export default function VapiDashboard({ complaints, onBack }: VapiDashboardProps) {
  // Only show complaints from VAPI (simulate: if summary/transcript looks like a voice complaint)
  const vapiReports = complaints.filter(c =>
    c.transcript && c.summary && c.transcript.toLowerCase().includes("voice")
  );

  // For the demo, if no obvious voice marker, fallback to all
  const rows = vapiReports.length ? vapiReports : complaints;

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-xl shadow-lg mt-8 p-5">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold text-blue-900">VAPI Reports Dashboard</h1>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Transcript</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.id}</TableCell>
                <TableCell className="max-w-xs truncate">{complaint.summary}</TableCell>
                <TableCell>
                  <span className="text-xs text-gray-500">{complaint.transcript?.slice(0, 80)}...</span>
                </TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>{complaint.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <div className="text-gray-400 text-center mt-8">No VAPI reports found.</div>
        )}
      </div>
    </div>
  );
}
