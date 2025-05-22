
import React from "react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/hooks/useSupabaseAuth";
import type { User } from "@supabase/supabase-js";

export default function ProfileCard({
  profile,
  user,
  loading,
  onSignOut,
  onBackHome,
}: {
  profile: Profile;
  user: User;
  loading: boolean;
  onSignOut: () => void;
  onBackHome: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-20 w-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-4xl text-gray-400">
        {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
      </div>
      <h3 className="font-bold text-lg">{profile.full_name || "No name"}</h3>
      <p className="text-gray-500 mb-2">{user?.email}</p>
      <p className="text-xs text-gray-400 mb-4">Profile ID: {profile.id}</p>
      <Button onClick={onSignOut} className="w-full" disabled={loading}>
        Sign Out
      </Button>
      <Button variant="secondary" className="mt-2 w-full" onClick={onBackHome} disabled={loading}>
        Back to Home
      </Button>
    </div>
  );
}
