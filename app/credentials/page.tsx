import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { PortfolioFrame, PortfolioPageHeading } from "@/components/portfolio-frame";
import { credentials } from "@/lib/portfolio-content";

export const metadata: Metadata = { title: "Credentials | Niranjan Reddy" };

export default function CredentialsPage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-proof portfolio-section portfolio-inner-page">
        <div className="portfolio-shell">
          <PortfolioPageHeading index="04 / 06" label="Credentials" title="Proof of practice." description="Certificates and profiles with links to the source." />
          <div className="portfolio-simple-list">
            {credentials.map((item, index) => (
              <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className="portfolio-list-row">
                <span className="portfolio-list-index">0{index + 1}</span>
                <strong>{item.title}</strong>
                <span>{item.issuer} / {item.label}</span>
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
          <p className="portfolio-pending">CompTIA Security+ verification link coming soon.</p>
        </div>
      </section>
    </PortfolioFrame>
  );
}
