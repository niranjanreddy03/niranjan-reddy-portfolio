"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContactInboxSignIn() {
  const router = useRouter();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get("error") === "google");
    void fetch("/api/contact/auth", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { configured: boolean; authenticated: boolean }) => {
        setConfigured(result.configured);
        if (result.authenticated) router.replace("/requests");
      })
      .catch(() => setConfigured(false));
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/50 p-7 sm:p-9">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">← Back to portfolio</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Private portfolio inbox</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Contact requests</h1>
        <p className="mt-3 text-sm text-slate-400">Sign in with your approved Google account to view messages submitted on the website.</p>
        {configured === false ? (
          <p role="status" className="mt-6 text-sm text-amber-300">Portfolio inbox SSO is waiting for its own Google credentials and owner settings.</p>
        ) : (
          <a href={configured === true ? "/api/contact/auth/google/start" : undefined} aria-disabled={configured !== true} className={`mt-7 flex h-11 w-full items-center justify-center rounded-md bg-blue-600 px-5 text-sm font-semibold text-white ${configured === true ? "hover:bg-blue-500" : "pointer-events-none opacity-50"}`}>Continue with Google</a>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-red-400">Google sign-in failed or this account is not authorized.</p>}
      </div>
    </main>
  );
}
