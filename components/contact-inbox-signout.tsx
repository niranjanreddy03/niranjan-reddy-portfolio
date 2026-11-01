"use client";

import { useState } from "react";

export function ContactInboxSignOut() {
  const [error, setError] = useState(false);

  async function signOut() {
    try {
      const response = await fetch("/api/contact/auth", { method: "DELETE" });
      if (!response.ok) throw new Error("Sign-out failed");
      window.location.assign("/requests/signin");
    } catch {
      setError(true);
    }
  }

  return (
    <div className="text-right">
      <button onClick={signOut} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">Sign out</button>
      {error && <p role="alert" className="text-xs text-red-400">Could not sign out. Try again.</p>}
    </div>
  );
}
