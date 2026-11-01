"use client";

import type { ReactNode } from "react";

export function CvDownloadLink({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className: string;
  onClick?: () => void;
}) {
  return (
    <a
      className={className}
      download="Niranjan_Reddy_Cybersecurity_CV.pdf"
      href="/Niranjan_Reddy_Cybersecurity_CV.pdf"
      onClick={() => {
        void fetch("/api/cv-downloads", {
          method: "POST",
          credentials: "same-origin",
          keepalive: true,
        }).catch(() => undefined);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
