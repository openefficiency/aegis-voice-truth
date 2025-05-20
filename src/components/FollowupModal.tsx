
import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FollowupModal({ open, onClose, complaints }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFollowup() {
    const complaint = complaints.find(
      c =>
        String(c.id) === code.trim() ||
        c.ackCode === code.trim()
    );
    if (!complaint) {
      setError("No complaint found with this code.");
      setResult(null);
    } else {
      setError("");
      setResult(complaint);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
          <h2 className="text-lg font-bold mb-4">Followup on Report</h2>
          <div className="mb-3">
            <Input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter your acknowledgement code"
              className="w-full"
            />
          </div>
          <Button className="w-full mb-2" onClick={handleFollowup} variant="secondary">
            Check Status
          </Button>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {result && (
            <div className="bg-gray-50 p-3 rounded mt-3 text-sm">
              <div>
                <b>Status:</b> {result.status}
              </div>
              <div>
                <b>Reward:</b> {result.rewarded ? "Rewarded" : "Pending"}
              </div>
              <div>
                <b>Summary:</b> {result.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
