"use client";

import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignIn({ nextPath, theme = "moneyflow" }: { nextPath: string; theme?: "moneyflow" | "portfolio" }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const portfolio = theme === "portfolio";
  useEffect(() => {
    const errorCode = new URLSearchParams(window.location.search).get("error");
    if (errorCode === "unauthorized") setError("This Google account is not authorized for the requested area.");
    else if (errorCode === "auth") setError("Sign-in could not be completed. Please try again.");
  }, []);

  async function signIn() {
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", nextPath);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback.toString() },
      });
      if (authError) throw authError;
    } catch {
      setBusy(false);
      setError("Sign-in could not start. Check the Supabase configuration and Google provider settings.");
    }
  }

  if (portfolio) return <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-5 py-12 text-white">
    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/50 p-7 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Private portfolio area</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-3 text-sm text-slate-400">Continue with the Google account authorized for this area.</p>
      {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
      <button onClick={signIn} disabled={busy} className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{busy ? "Connecting…" : "Continue with Google"}<ArrowRight size={17} /></button>
    </div>
  </main>;

  return <main className="mf-signin-page"><div className="mf-signin-card">
    <span className="mf-signin-mark"><LockKeyhole size={23} /></span>
    <span className="mf-eyebrow">PRIVATE MONEYFLOW WORKSPACE</span>
    <h1>Welcome back.</h1>
    <p>Sign in with your approved Google account to view and manage your financial data.</p>
    {error && <div className="mf-signin-error" role="alert">{error}</div>}
    <button className="mf-google-button" onClick={signIn} disabled={busy}><span>G</span> {busy ? "Connecting…" : "Continue with Google"} <ArrowRight size={17} /></button>
  </div></main>;
}
