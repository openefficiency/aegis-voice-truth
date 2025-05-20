// Main landing page - includes CTA, Voice Widget, Dashboard access, and creds.

import React, { useRef, useState } from "react";
import VoiceReportWidget from "@/components/VoiceReportWidget";
import EthicsOfficerDashboard from "./dashboard/EthicsOfficerDashboard";
import InvestigatorDashboard from "./dashboard/InvestigatorDashboard";
import { toast } from "@/hooks/use-toast";

const ETHICS_USERNAME = "ethics@aegiswhistle.com";
const ETHICS_PASSWORD = "Ethics123!";
const INVESTIGATOR_USERNAME = "investigator@aegiswhistle.com";
const INVESTIGATOR_PASSWORD = "Investigate456!";

// Simple in-memory complaints store (reset on reload)
const getInitialComplaints = () => [
  // Pre-populate with a sample complaint
  {
    id: 1,
    summary: "The procurement process is being bypassed in certain departments.",
    transcript: "I want to report that purchases are made outside standard protocol...",
    status: "open",
    category: "fraud",
    assignedTo: "",
    timestamp: "2024-05-20 10:29",
    audioUrl: "",
    notes: "",
    auditTrail: [
      { action: "Complaint submitted", timestamp: "2024-05-20 10:29" },
    ],
    rewarded: false,
  }
];

export default function Index() {
  const [complaints, setComplaints] = useState(getInitialComplaints());
  const [role, setRole] = useState<"officer" | "investigator">("officer");
  const [currentUsername, setCurrentUsername] = useState("");
  const reportSectionRef = useRef<HTMLDivElement>(null);

  // Simulate report creation
  function handleComplaintSubmitted(complaint) {
    setComplaints((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        summary: complaint.summary ?? "Test voice complaint summary",
        transcript: complaint.transcript || "",
        status: "open",
        category: complaint.category || "whistleblowing",
        assignedTo: "",
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        audioUrl: complaint.audioUrl || "",
        notes: "",
        rewarded: false,
        auditTrail: [
          { action: "Complaint submitted", timestamp: new Date().toISOString().slice(0, 16).replace("T", " ") },
        ],
      }
    ]);
    toast({ title: "Complaint Received!", description: "Your voice report was logged successfully." });
  }

  // Officer actions
  function assignCase(id, investigator) {
    setComplaints(cs => cs.map(c => c.id === id ? {
      ...c,
      assignedTo: investigator,
      auditTrail: [...(c.auditTrail || []), { action: `Assigned to ${investigator}`, timestamp: nowstr() }],
    } : c));
    toast({ title: "Assigned", description: "Case assigned to " + investigator });
  }
  function onResolve(id) {
    setComplaints(cs => cs.map(c => c.id === id ? {
      ...c,
      status: "resolved",
      auditTrail: [...(c.auditTrail || []), { action: "Marked as resolved", timestamp: nowstr() }],
      rewarded: true,
    } : c));
    toast({ title: "Case resolved!", description: "Case resolved and whistleblower rewarded." });
  }
  function onEscalate(id) {
    setComplaints(cs => cs.map(c => c.id === id ? {
      ...c,
      status: "escalated",
      auditTrail: [...(c.auditTrail || []), { action: "Escalated", timestamp: nowstr() }],
    } : c));
    toast({ title: "Case Escalated", description: "Case escalated for further review." });
  }
  function onReward(id) {
    setComplaints(cs => cs.map(c => c.id === id ? {
      ...c,
      rewarded: true,
      auditTrail: [...(c.auditTrail || []), { action: "Whistleblower anonymously rewarded", timestamp: nowstr() }],
    } : c));
    toast({ title: "Reward Sent", description: "Crypto reward sent anonymously for this case." });
  }
  function onUpdateNote(id, note) {
    setComplaints(cs => cs.map(c => c.id === id ? {
      ...c,
      notes: note,
      auditTrail: [...(c.auditTrail || []), { action: "Investigator note added", timestamp: nowstr() }],
    } : c));
    toast({ title: "Update Added" });
  }

  function nowstr() {
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  }

  function handleMakeReport() {
    reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Authentication logic for demo (credential check)
  function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const user = form.role.value === "officer" ? ETHICS_USERNAME : INVESTIGATOR_USERNAME;
    const pass = form.role.value === "officer" ? ETHICS_PASSWORD : INVESTIGATOR_PASSWORD;
    if (form.username.value === user && form.password.value === pass) {
      setRole(form.role.value);
      setCurrentUsername(form.username.value);
      toast({ title: "Logged in!", description: `Logged in as ${form.role.value === "officer" ? "Ethics Officer" : "Investigator"}` });
    } else {
      toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="py-8 px-4 max-w-4xl mx-auto flex flex-col items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-400 text-transparent bg-clip-text mb-2">
          Aegis Whistle — Voice-Driven Whistleblower Platform
        </h1>
        <div className="text-lg text-gray-500 font-medium">Empower voices. Protect truth. Reward integrity.</div>
        <button
          className="mt-4 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={handleMakeReport}>
          Make a Report
        </button>
      </header>
      <main className="max-w-4xl mx-auto px-2">
        <section className="my-8" ref={reportSectionRef}>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🗣️ Report a Concern</h2>
          <VoiceReportWidget onComplaintSubmitted={handleComplaintSubmitted} />
        </section>
        <section className="my-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            Ethics Officer Dashboard / Investigator Workspace
          </h2>
          <div className="flex items-center gap-4 mb-4 bg-white shadow rounded-lg p-3">
            <form className="flex items-center gap-4" onSubmit={handleLogin}>
              <select name="role" defaultValue={role} className="border px-2 py-1 rounded bg-gray-50">
                <option value="officer">Ethics Officer</option>
                <option value="investigator">Investigator</option>
              </select>
              <input name="username" placeholder="Username" className="border px-2 py-1 rounded" required />
              <input name="password" type="password" placeholder="Password" className="border px-2 py-1 rounded" required />
              <button className="bg-blue-500 text-white rounded px-4 py-1 font-semibold">Login</button>
            </form>
            <div className="ml-4 text-xs flex flex-col text-gray-400">
              <span>Officer: {ETHICS_USERNAME} / <b>Ethics123!</b></span>
              <span>Investigator: {INVESTIGATOR_USERNAME} / <b>Investigate456!</b></span>
            </div>
          </div>
          {role === "officer" ? (
            <EthicsOfficerDashboard
              complaints={complaints}
              assignCase={assignCase}
              showControls={true}
              onResolve={onResolve}
              onEscalate={onEscalate}
              onReward={onReward}
              role={role}
              currentUsername={currentUsername}
              onUpdateNote={onUpdateNote}
            />
          ) : (
            <InvestigatorDashboard
              complaints={complaints}
              showControls={false}
              role={role}
              onUpdateNote={onUpdateNote}
              currentUsername={currentUsername}
              assignCase={() => {}}
              onResolve={() => {}}
              onEscalate={() => {}}
              onReward={() => {}}
            />
          )}
        </section>
      </main>
    </div>
  );
}
