import type { ReactNode } from "react";
import Link from "next/link";

import { Navbar } from "@/components/navbar";

export function PortfolioFrame({ children }: { children: ReactNode }) {
  return (
    <main className="portfolio">
      <Navbar />
      {children}
      <footer className="portfolio-footer">
        <div className="portfolio-shell">
          <span>© 2026 Niranjan Reddy</span>
          <span>Cybersecurity / Blue Team / Cloud</span>
          <Link href="/">Back to home ↑</Link>
        </div>
      </footer>
    </main>
  );
}

export function PortfolioPageHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="portfolio-section-heading">
      <div className="portfolio-section-label"><span>{index}</span>{label}</div>
      <div>
        <h1 className="portfolio-page-title">{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
