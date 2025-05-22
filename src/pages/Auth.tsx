
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import ProfileCard from "@/components/ProfileCard";

// Types for Supabase session and user and Profile table
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/hooks/useSupabaseAuth";

const Auth = () => {
  const {
    session,
    user,
    profile,
    loading,
    view,
    setView,
    setLoading,
    setSession,
    setUser,
    setProfile,
  } = useSupabaseAuth();
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { email, password, full_name } = form;
    const { error } = await supabase.auth.signUp({
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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

        {view === "profile" && profile && user && (
          <ProfileCard
            profile={profile}
            user={user}
            loading={loading}
            onSignOut={handleSignOut}
            onBackHome={() => navigate("/")}
          />
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
              autoComplete={view === "signup" ? "new-password" : "current-password"}
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

            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Loading..."
                : view === "signin"
                ? "Sign In"
                : "Sign Up"}
            </Button>
            <div className="flex justify-between text-xs mt-2">
              {view === "signin" ? (
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
              ) : (
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
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
