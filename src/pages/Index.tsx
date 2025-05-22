// Main landing page - includes CTA, Voice Widget, Dashboard access, and creds.

import React, { useRef, useState } from "react";
import VoiceReportWidget from "@/components/VoiceReportWidget";
import EthicsOfficerDashboard from "./dashboard/EthicsOfficerDashboard";
import InvestigatorDashboard from "./dashboard/InvestigatorDashboard";
import { toast } from "@/hooks/use-toast";
import FollowupModal from "@/components/FollowupModal";
import { Dialog } from "@/components/ui/dialog";

const ETHICS_USERNAME = "ethics@aegiswhistle.com";
const ETHICS_PASSWORD = "Ethics123!";
const INVESTIGATOR_USERNAME = "investigator@aegiswhistle.com";
const INVESTIGATOR_PASSWORD = "Investigate456!";

// Simple in-memory complaints store (reset on reload)
const getInitialComplaints = () => [
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
    ackCode: "1",
  }
];

export default function Index() {
  const [complaints, setComplaints] = useState(getInitialComplaints());
  const [role, setRole] = useState<"officer" | "investigator">("officer");
  const [currentUsername, setCurrentUsername] = useState("");
  const [showFollowup, setShowFollowup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginRole, setLoginRole] = useState<"officer" | "investigator">("officer");
  const [ackCode, setAckCode] = useState(""); // Store Ack Code to show
  const reportSectionRef = useRef<HTMLDivElement>(null);

  // Simulate report creation, now with ackCode
  function handleComplaintSubmitted(complaint) {
    const newId = complaints.length ? complaints[complaints.length - 1].id + 1 : 1;
    const ack = (
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      (1000 + Math.floor(Math.random() * 9000))
    );

    const newComplaint = {
      id: newId,
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
      ackCode: ack,
    };
    setComplaints(prev => [...prev, newComplaint]);
    setAckCode(ack);
    toast({ title: "Complaint Received!", description: `Your report was logged. Ack Code: ${ack}` });
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

  // Show login modal and change role
  function handleLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const user =
      loginRole === "officer" ? ETHICS_USERNAME : INVESTIGATOR_USERNAME;
    const pass =
      loginRole === "officer" ? ETHICS_PASSWORD : INVESTIGATOR_PASSWORD;
    if (
      form.username.value === user &&
      form.password.value === pass
    ) {
      setRole(loginRole);
      setCurrentUsername(form.username.value);
      setShowLogin(false);
      toast({ title: "Logged in!", description: `Logged in as ${loginRole === "officer" ? "Ethics Officer" : "Investigator"}` });
    } else {
      toast({ title: "Login failed", description: "Invalid credentials", variant: "destructive" });
    }
  }

  // Navigation buttons
  function triggerLogin(r) {
    setLoginRole(r);
    setShowLogin(true);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top nav/header */}
      <header className="flex items-center gap-4 justify-between p-4 pb-2 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-700 to-blue-400 text-transparent bg-clip-text">Aegis Whistle</span>
          <span className="ml-2 text-sm text-gray-400 hidden md:block">Voice-Driven Whistleblower Platform</span>
        </div>
        <div className="flex gap-2 items-center flex-1 justify-end">
          <a
            href="/auth"
            className="text-blue-600 border border-blue-600 font-semibold rounded px-3 py-1 hover:bg-blue-50"
          >
            Login / Signup
          </a>
          <button
            className="text-blue-600 border border-blue-600 font-semibold rounded px-3 py-1 hover:bg-blue-50"
            onClick={() => triggerLogin("officer")}
          >
            Ethics Officer Login
          </button>
          <button
            className="text-blue-600 border border-blue-600 font-semibold rounded px-3 py-1 hover:bg-blue-50"
            onClick={() => triggerLogin("investigator")}
          >
            Investigator Login
          </button>
          <button
            className="ml-2 px-3 py-1 rounded font-semibold bg-gray-100 text-blue-600 border border-blue-600 hover:bg-blue-50"
            onClick={() => setShowFollowup(true)}
          >
            Followup
          </button>
        </div>
      </header>

      {showLogin && (
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
              <h2 className="font-bold text-lg mb-2">Login as {loginRole === "officer" ? "Ethics Officer" : "Investigator"}</h2>
              <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
                <input name="username" placeholder="Username" className="border px-2 py-1 rounded" required defaultValue={loginRole==="officer"?ETHICS_USERNAME:INVESTIGATOR_USERNAME} />
                <input name="password" type="password" placeholder="Password" className="border px-2 py-1 rounded" required defaultValue={loginRole==="officer"?ETHICS_PASSWORD:INVESTIGATOR_PASSWORD}/>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" className="text-gray-400" onClick={()=>setShowLogin(false)}>Cancel</button>
                  <button type="submit" className="bg-blue-500 text-white rounded px-4 py-1 font-semibold">Login</button>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      )}

      <main className="max-w-4xl mx-auto px-2 pb-16">
        <section className="mt-4 mb-2 flex flex-col items-center">
          <button
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={handleMakeReport}
          >
            Make a Report
          </button>
        </section>
        <section className="my-8" ref={reportSectionRef}>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">🗣️ Report a Concern</h2>
          <VoiceReportWidget onComplaintSubmitted={handleComplaintSubmitted} />
          {ackCode && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center">
              <span className="text-green-700 font-bold">
                Your Report Acknowledgement Code:
              </span>
              <span className="text-lg font-mono tracking-wide text-green-600">{ackCode}</span>
              <span className="text-xs text-gray-400 mt-2">
                Please save this code to check your complaint status or reward follow-up.
              </span>
            </div>
          )}
        </section>
        <section className="my-8">
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

      {showFollowup && (
        <FollowupModal
          open={showFollowup}
          onClose={()=>setShowFollowup(false)}
          complaints={complaints}
        />
      )}
    </div>
  );
}
