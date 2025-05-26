
// A simple, typeform-style popup for whistleblowers who want to type instead of speak.

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WriteReportModal({ open, onClose, onSubmit }) {
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("fraud");
  const [details, setDetails] = useState("");
  const [step, setStep] = useState(0);

  function handleNext() {
    if (step < 2) setStep(s => s + 1);
    else handleSubmit();
  }
  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }
  function handleSubmit() {
    onSubmit({ summary, category, transcript: details });
    onClose();
    setSummary(""); setCategory("fraud"); setDetails(""); setStep(0);
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
          <h2 className="font-bold text-xl mb-4 text-blue-800">Submit Your Concern</h2>
          <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
            {step === 0 && (
              <div>
                <label className="font-semibold mb-1 block">Type of Concern</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="border px-2 py-2 rounded w-full mb-4">
                  <option value="fraud">Fraud or Financial Manipulation</option>
                  <option value="harassment">Harassment or Discrimination</option>
                  <option value="policy">Policy Violation</option>
                  <option value="other">Other</option>
                </select>
                <Button className="w-full mt-2" type="button" onClick={handleNext}>Next</Button>
              </div>
            )}
            {step === 1 && (
              <div>
                <label className="font-semibold mb-1 block">Brief Summary</label>
                <input value={summary} onChange={e => setSummary(e.target.value)} required maxLength={100} placeholder="E.g. Contract bypassed" className="border px-2 py-2 rounded w-full mb-4" />
                <Button className="w-full mb-2" type="button" onClick={handleNext}>Next</Button>
                <Button className="w-full" type="button" variant="secondary" onClick={handleBack}>Back</Button>
              </div>
            )}
            {step === 2 && (
              <div>
                <label className="font-semibold mb-1 block">Describe what happened (optional)</label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows={5} placeholder="How did this happen, when, who else knows?" className="border px-2 py-2 rounded w-full mb-4" />
                <Button className="w-full mb-2" type="submit">Submit</Button>
                <Button className="w-full" type="button" variant="secondary" onClick={handleBack}>Back</Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Dialog>
  );
}
