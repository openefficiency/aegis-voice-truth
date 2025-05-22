
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Types for Supabase session and user
import type { Session, User } from "@supabase/supabase-js";

// Profiles table shape
type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

const Auth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"signin" | "signup" | "profile">("signin");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle auth state on mount and update session
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

  // Fetch profile when user changes
  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (data) setProfile(data as Profile);
        });
      setView("profile");
    } else {
      setProfile(null);
      setView("signin");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { email, password, full_name } = form;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      toast({ title: "Check your email", description: "A confirmation link was sent!" });
      setView("signin");
    }
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { email, password } = form;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    }
  }

  async function handleSignOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setSession(null);
    setUser(null);
    setProfile(null);
    setView("signin");
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <div className="bg-white shadow rounded-xl max-w-md w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          {view === "profile"
            ? "Your Profile"
            : view === "signin"
            ? "Sign In"
            : "Sign Up"}
        </h2>

        {view === "profile" && profile && (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-4xl text-gray-400">
              {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <h3 className="font-bold text-lg">{profile.full_name || "No name"}</h3>
            <p className="text-gray-500 mb-2">{user?.email}</p>
            <p className="text-xs text-gray-400 mb-4">
              Profile ID: {profile.id}
            </p>
            <Button onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
            <Button
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        )}

        {(view === "signin" || view === "signup") && (
          <form
            onSubmit={view === "signin" ? handleSignIn : handleSignUp}
            className="space-y-3"
          >
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
              autoComplete="username"
              className="w-full"
              disabled={loading}
            />
            <Input
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              type="password"
              required
              autoComplete={
                view === "signup" ? "new-password" : "current-password"
              }
              className="w-full"
              disabled={loading}
            />
            {view === "signup" && (
              <Input
                name="full_name"
                placeholder="Full Name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full"
                required
                disabled={loading}
              />
            )}

            {error && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Loading..."
                : view === "signin"
                ? "Sign In"
                : "Sign Up"}
            </Button>
            <div className="flex justify-between text-xs mt-2">
              {view === "signin" ? (
                <>
                  <span>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setView("signup")}
                      className="text-blue-600 underline"
                      disabled={loading}
                    >
                      Sign Up
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setView("signin")}
                      className="text-blue-600 underline"
                      disabled={loading}
                    >
                      Sign In
                    </button>
                  </span>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
