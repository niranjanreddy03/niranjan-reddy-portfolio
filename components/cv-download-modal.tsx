"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownToLine, X } from "lucide-react";

const dismissedKey = "niranjan-cv-prompt-dismissed";

export function CvDownloadModal() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => {
    window.sessionStorage.setItem(dismissedKey, "true");
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(dismissedKey)) return;

    const timer = window.setTimeout(() => setIsOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="cv-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeModal();
    }}>
      <section
        aria-labelledby="cv-modal-title"
        aria-modal="true"
        className="cv-modal"
        role="dialog"
      >
        <button
          aria-label="Close CV download prompt"
          autoFocus
          className="cv-modal-close"
          onClick={closeModal}
          type="button"
        >
          <X size={19} />
        </button>
        <span className="cv-modal-kicker">A QUICK INTRODUCTION</span>
        <h2 id="cv-modal-title">Want to know more about my work?</h2>
        <p>Download my CV for a closer look at my cybersecurity experience, projects, and skills.</p>
        <a
          className="cv-modal-download"
          download="Niranjan_Reddy_Cybersecurity_CV.pdf"
          href="/Niranjan_Reddy_Cybersecurity_CV.pdf"
          onClick={closeModal}
        >
          Download my CV <ArrowDownToLine size={18} />
        </a>
        <button className="cv-modal-later" onClick={closeModal} type="button">
          Maybe later
        </button>
      </section>
    </div>
  );
}
