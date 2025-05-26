
import React, { useState } from "react";
import VoiceReportWidget from "@/components/VoiceReportWidget";
import { Button } from "@/components/ui/button";
import WriteReportModal from "@/components/WriteReportModal";
import DashboardStats from "@/components/DashboardStats";
import FollowupModal from "@/components/FollowupModal";
import TeamAegisLoginModal from "@/components/TeamAegisLoginModal";
import { useComplaints } from "@/hooks/useComplaints";

export default function Index() {
  const [showWrite, setShowWrite] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const [role, setRole] = useState<"officer" | "investigator">("officer");
  const [currentUsername, setCurrentUsername] = useState("");
  const [loginRole, setLoginRole] = useState<"officer" | "investigator">("officer");

  const {
    complaints,
    ackCode,
    handleComplaintSubmitted,
  } = useComplaints();

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
          <h1 className="text-2xl font-bold text-center mb-4 text-blue-900">
            Whistleblowing. Made Effortless.
          </h1>
          <VoiceReportWidget onComplaintSubmitted={handleComplaintSubmitted} />
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-3 text-gray-500 bg-gray-50 px-2">or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowWrite(true)}
          >
            Submit by Writing Instead
          </Button>
        </section>
        {ackCode && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center">
            <span className="text-green-700 font-bold">
              Your Report Code:
            </span>
            <span className="text-lg font-mono tracking-wide text-green-600">
              {ackCode}
            </span>
            <span className="text-xs text-gray-400 mt-2">
              Save this code to check status or reward updates!
            </span>
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

      {/* Team Aegis Login modal */}
      {showLogin && (
        <TeamAegisLoginModal
          open={showLogin}
          setOpen={setShowLogin}
          loginRole={loginRole}
          setLoginRole={setLoginRole}
          setRole={setRole}
          setCurrentUsername={setCurrentUsername}
        />
      )}
    </div>
  );
}
