
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

export function useComplaints() {
  // Simple in-memory complaints store (reset on reload)
  const getInitialComplaints = () => [
    {
      id: 1,
      summary:
        "The procurement process is being bypassed in certain departments.",
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

  const [complaints, setComplaints] = useState(getInitialComplaints());
  const [ackCode, setAckCode] = useState(""); // store code after submit

  // Used for scrolling
  const reportSectionRef = useRef<HTMLDivElement>(null);

  function nowstr() {
    return new Date().toISOString().slice(0, 16).replace("T", " ");
  }

  // Called by both voice and write flows
  function handleComplaintSubmitted({ summary, transcript, category, audioUrl }) {
    const newId = complaints.length
      ? complaints[complaints.length - 1].id + 1
      : 1;
    // New 10-char code (VAPI is required to generate and return, but fallback here)
    const ack = (
      Math.random().toString(36).substring(2, 7).toUpperCase() +
      Math.random().toString(36).substring(2, 7).toUpperCase()
    ).substring(0, 10);
    const newComplaint = {
      id: newId,
      summary: summary ?? "Voice complaint summary",
      transcript: transcript || "",
      status: "open",
      category: category || "general",
      timestamp: nowstr(),
      audioUrl: audioUrl || "",
      ackCode: ack,
      rewarded: false,
      assignedTo: "",
      notes: "",
      auditTrail: [
        { action: "Complaint submitted", timestamp: nowstr() },
      ],
    };
    setComplaints((prev) => [...prev, newComplaint]);
    setAckCode(ack);
    toast({
      title: "Report received!",
      description: `Your Acknowledgement Code: ${ack}`,
    });
  }

  // Officer actions (kept same as before)
  function assignCase(id, investigator) {
    setComplaints(cs =>
      cs.map(c =>
        c.id === id
          ? {
              ...c,
              assignedTo: investigator,
              auditTrail: [
                ...(c.auditTrail || []),
                { action: `Assigned to ${investigator}`, timestamp: nowstr() },
              ],
            }
          : c
      )
    );
    toast({ title: "Assigned", description: "Case assigned to " + investigator });
  }
  function onResolve(id) {
    setComplaints(cs =>
      cs.map(c =>
        c.id === id
          ? {
              ...c,
              status: "resolved",
              auditTrail: [
                ...(c.auditTrail || []),
                { action: "Marked as resolved", timestamp: nowstr() },
              ],
              rewarded: true,
            }
          : c
      )
    );
    toast({
      title: "Case resolved!",
      description: "Case resolved and whistleblower rewarded.",
    });
  }
  function onEscalate(id) {
    setComplaints(cs =>
      cs.map(c =>
        c.id === id
          ? {
              ...c,
              status: "escalated",
              auditTrail: [
                ...(c.auditTrail || []),
                { action: "Escalated", timestamp: nowstr() },
              ],
            }
          : c
      )
    );
    toast({
      title: "Case Escalated",
      description: "Case escalated for further review.",
    });
  }
  function onReward(id) {
    setComplaints(cs =>
      cs.map(c =>
        c.id === id
          ? {
              ...c,
              rewarded: true,
              auditTrail: [
                ...(c.auditTrail || []),
                { action: "Whistleblower anonymously rewarded", timestamp: nowstr() },
              ],
            }
          : c
      )
    );
    toast({
      title: "Reward Sent",
      description: "Crypto reward sent anonymously for this case.",
    });
  }
  function onUpdateNote(id, note) {
    setComplaints(cs =>
      cs.map(c =>
        c.id === id
          ? {
              ...c,
              notes: note,
              auditTrail: [
                ...(c.auditTrail || []),
                { action: "Investigator note added", timestamp: nowstr() },
              ],
            }
          : c
      )
    );
    toast({ title: "Update Added" });
  }

  function handleMakeReport() {
    reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return {
    complaints,
    setComplaints,
    ackCode,
    setAckCode,
    reportSectionRef,
    handleComplaintSubmitted,
    assignCase,
    onResolve,
    onEscalate,
    onReward,
    onUpdateNote,
    handleMakeReport,
  };
}

