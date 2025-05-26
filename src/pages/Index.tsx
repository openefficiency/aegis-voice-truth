import React, { useState } from "react";
import WriteReportModal from "@/components/WriteReportModal";
import FollowupModal from "@/components/FollowupModal";
import TeamAegisLoginModal from "@/components/TeamAegisLoginModal";
import { useComplaints } from "@/hooks/useComplaints";
import Header from "@/components/Header";
import ReportSection from "@/components/ReportSection";
import FooterStats from "@/components/FooterStats";

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

  function triggerLogin(r: "officer" | "investigator") {
    setLoginRole(r);
    setShowLogin(true);
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header
        onLogin={() => setShowLogin(true)}
        onFollowup={() => setShowFollowup(true)}
      />
      <ReportSection
        onWrite={() => setShowWrite(true)}
        ackCode={ackCode}
        handleComplaintSubmitted={handleComplaintSubmitted}
      />
      <FooterStats complaints={complaints} />
      {showFollowup && (
        <FollowupModal
          open={showFollowup}
          onClose={() => setShowFollowup(false)}
          complaints={complaints}
        />
      )}
      {showWrite && (
        <WriteReportModal
          open={showWrite}
          onClose={() => setShowWrite(false)}
          onSubmit={handleComplaintSubmitted}
        />
      )}
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
