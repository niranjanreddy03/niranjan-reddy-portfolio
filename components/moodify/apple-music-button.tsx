"use client";

import { Check, LoaderCircle, Music2 } from "lucide-react";

export type AppleMusicStatus = "loading" | "unconfigured" | "ready" | "connecting" | "connected" | "error";

type Props = { status: AppleMusicStatus; onConnect: () => void; onDisconnect: () => void; onUnavailable: () => void };

export function AppleMusicButton({ status, onConnect, onDisconnect, onUnavailable }: Props) {
  const busy = status === "loading" || status === "connecting";
  const connected = status === "connected";
  return (
    <button
      type="button"
      className={`mf-apple-button ${connected ? "is-connected" : ""}`}
      onClick={connected ? onDisconnect : status === "ready" ? onConnect : onUnavailable}
      aria-label={connected ? "Disconnect Apple Music" : "Connect Apple Music"}
      aria-busy={busy}
      title={connected ? "Disconnect Apple Music" : "Connect your Apple Music account"}
    >
      {busy ? <LoaderCircle size={16} className="mf-apple-spin" aria-hidden="true" /> : connected ? <Check size={16} aria-hidden="true" /> : <Music2 size={16} aria-hidden="true" />}
      <span>{connected ? "Apple Music connected" : status === "connecting" ? "Connecting..." : "Connect Apple Music"}</span>
    </button>
  );
}
