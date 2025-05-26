// Main landing page — streamlined for anonymous report via VAPI (or write), stats at bottom, Team Aegis/Followup in header.

import React, { useRef, useState } from "react";
import VoiceReportWidget from "@/components/VoiceReportWidget";
import { Button } from "@/components/ui/button";
import WriteReportModal from "@/components/WriteReportModal";
import DashboardStats from "@/components/DashboardStats";
import FollowupModal from "@/components/FollowupModal";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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
  const [showWrite, setShowWrite] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [role, setRole] = useState<"officer" | "investigator">("officer");
  const [currentUsername, setCurrentUsername] = useState("");
  const [loginRole, setLoginRole] = useState<"officer" | "investigator">("officer");

  // In-memory complaints for demo (simulate backend)
  const [complaints, setComplaints] = useState(getInitialComplaints());
  const [ackCode, setAckCode] = useState(""); // store code after submit
  const reportSectionRef = useRef<HTMLDivElement>(null);

  // Called by both voice and write flows
  function handleComplaintSubmitted({ summary, transcript, category, audioUrl }) {
    const newId = complaints.length ? complaints[complaints.length - 1].id + 1 : 1;
    // New 10-char code (VAPI is required to generate and return, but fallback here)
    const ack = (
      Math.random().toString(36).substring(2, 7).toUpperCase() +
      Math.random().toString(36).substring(2, 7).toUpperCase()
    ).substring(0,10);
    const newComplaint = {
      id: newId,
      summary: summary ?? "Voice complaint summary",
      transcript: transcript || "",
      status: "open",
      category: category || "general",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      audioUrl: audioUrl || "",
      ackCode: ack,
      rewarded: false,
    };
    setComplaints((prev) => [...prev, newComplaint]);
    setAckCode(ack);
    toast({
      title: "Report received!",
      description: `Your Acknowledgement Code: ${ack}`,
    });
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-500 text-transparent bg-clip-text">
            <img src="/logo.svg" alt="Aegis" className="h-8 w-8 inline-block mr-2" />
            Aegis Whistle
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => setShowLogin(true)}>Team Aegis Login</Button>
          <Button variant="default" onClick={() => setShowFollowup(true)}>Followup</Button>
        </div>
      </header>

      {/* Main: Speak-up and "write" alt */}
      <main className="flex-1 flex flex-col justify-center items-center px-2">
        <section className="max-w-lg w-full my-8">
          <h1 className="text-2xl font-bold text-center mb-4 text-blue-900">Whistleblowing. Made Effortless.</h1>
          <VoiceReportWidget onComplaintSubmitted={handleComplaintSubmitted} />
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-gray-500 bg-gray-50 px-2">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setShowWrite(true)}>
            Submit by Writing Instead
          </Button>
        </section>
        {ackCode && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center">
            <span className="text-green-700 font-bold">Your Report Code:</span>
            <span className="text-lg font-mono tracking-wide text-green-600">{ackCode}</span>
            <span className="text-xs text-gray-400 mt-2">Save this code to check status or reward updates!</span>
          </div>
        )}
      </main>

      {/* Dashboard stat cards at bottom */}
      <div className="max-w-3xl mx-auto w-full mb-4">
        <DashboardStats complaints={complaints} />
      </div>

      {/* Followup modal */}
      {showFollowup && (
        <FollowupModal
          open={showFollowup}
          onClose={() => setShowFollowup(false)}
          complaints={complaints}
        />
      )}

      {/* Write report modal */}
      {showWrite && (
        <WriteReportModal
          open={showWrite}
          onClose={() => setShowWrite(false)}
          onSubmit={handleComplaintSubmitted}
        />
      )}

      {/* Login modal placeholder */}
      {showLogin && (
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
              <h2 className="font-bold text-lg mb-2">Login to Team Aegis</h2>
              <div className="mb-4 text-sm text-gray-500">Officers and Investigators: Please enter your credentials to access the Dashboard.</div>
              {/* Mocked login: direct dashboard logic to be improved */}
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
    </div>
  );
}
