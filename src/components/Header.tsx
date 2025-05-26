
import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLogin: () => void;
  onFollowup: () => void;
}

export default function Header({ onLogin, onFollowup }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl bg-gradient-to-r from-blue-900 to-blue-500 text-transparent bg-clip-text">
          <img src="/logo.svg" alt="Aegis" className="h-8 w-8 inline-block mr-2" />
          Aegis Whistle
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Button variant="outline" onClick={onLogin}>Team Aegis Login</Button>
        <Button variant="default" onClick={onFollowup}>Followup</Button>
      </div>
    </header>
  );
}
