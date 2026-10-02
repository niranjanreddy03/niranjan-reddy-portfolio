"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [googleError, setGoogleError] = useState(false);
  useEffect(() => {
    setGoogleError(new URLSearchParams(window.location.search).get("error") === "google");
    void fetch("/api/moneyflow/auth", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { configured: boolean; user: unknown }) => {
        setConfigured(result.configured);
        if (result.user) { router.replace("/moneyflow"); router.refresh(); }
      })
      .catch(() => setConfigured(false));
  }, [router]);

  return <main className="mf-signin-page"><div className="mf-signin-card">
    <span className="mf-signin-mark"><LockKeyhole size={23} /></span>
    <span className="mf-eyebrow">PRIVATE MONEYFLOW WORKSPACE</span>
    <h1>Welcome back.</h1>
    <p>Sign in with your approved Google account to view and manage your financial data.</p>
    {googleError && <div className="mf-signin-error" role="alert">Google sign-in was unsuccessful or this account is not authorized.</div>}
    {configured === false && <div className="mf-signin-error" role="status">MoneyFlow is waiting for its database and Google sign-in configuration.</div>}
    {configured === true ? <a className="mf-google-button" href="/api/moneyflow/auth/google/start"><span>G</span> Continue with Google <ArrowRight size={17} /></a> : <span className="mf-google-button mf-google-disabled"><span>G</span> Continue with Google</span>}
  </div></main>;
}
