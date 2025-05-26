
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  loginRole: "officer" | "investigator";
  setLoginRole: (r: "officer" | "investigator") => void;
  setRole: (r: "officer" | "investigator") => void;
  setCurrentUsername: (username: string) => void;
}

const ETHICS_USERNAME = "ethics@aegiswhistle.com";
const ETHICS_PASSWORD = "Ethics123!";
const INVESTIGATOR_USERNAME = "investigator@aegiswhistle.com";
const INVESTIGATOR_PASSWORD = "Investigate456!";

export default function TeamAegisLoginModal({
  open,
  setOpen,
  loginRole,
  setLoginRole,
  setRole,
  setCurrentUsername,
}: Props) {
  // Show login modal and change role
  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement & {
      username: { value: string };
      password: { value: string };
    };
    const user = loginRole === "officer" ? ETHICS_USERNAME : INVESTIGATOR_USERNAME;
    const pass = loginRole === "officer" ? ETHICS_PASSWORD : INVESTIGATOR_PASSWORD;
    if (
      form.username.value === user &&
      form.password.value === pass
    ) {
      setRole(loginRole);
      setCurrentUsername(form.username.value);
      setOpen(false);
      toast({ title: "Logged in!", description: `Logged in as ${loginRole === "officer" ? "Ethics Officer" : "Investigator"}` });
    } else {
      // Improved error messaging
      let reasons = [];
      if (form.username.value !== user) reasons.push("username");
      if (form.password.value !== pass) reasons.push("password");
      toast({
        title: "Login failed",
        description:
          `Invalid ${reasons.join(" and ")} for ${loginRole === "officer" ? "Ethics Officer" : "Investigator"}` +
          ". Expected demo credentials. (See documentation if unsure.)",
        variant: "destructive"
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
          <h2 className="font-bold text-lg mb-2">Login to Team Aegis</h2>
          <div className="mb-4 text-sm text-gray-500">
            Officers and Investigators: Please enter your credentials to access the Dashboard.
          </div>
          {/* Mocked login: direct dashboard logic to be improved */}
          <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
            <input
              name="username"
              placeholder="Username"
              className="border px-2 py-1 rounded"
              required
              defaultValue={
                loginRole === "officer" ? ETHICS_USERNAME : INVESTIGATOR_USERNAME
              }
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border px-2 py-1 rounded"
              required
              defaultValue={
                loginRole === "officer" ? ETHICS_PASSWORD : INVESTIGATOR_PASSWORD
              }
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="text-gray-400"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded px-4 py-1 font-semibold"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
