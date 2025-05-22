
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

type AuthView = "signin" | "signup" | "profile";

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AuthView>("signin");

  // Auth flow
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data as Profile);
        });
      setView("profile");
    } else {
      setProfile(null);
      setView("signin");
    }
  }, [user]);

  return { session, user, profile, loading, view, setView, setLoading, setSession, setUser, setProfile };
}
