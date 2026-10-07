import type { Metadata } from "next";

import { PortfolioFrame, PortfolioPageHeading } from "@/components/portfolio-frame";
import { experiences } from "@/lib/portfolio-content";

export const metadata: Metadata = { title: "Experience | Niranjan Reddy" };

export default function ExperiencePage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-experience portfolio-section portfolio-inner-page">
        <div className="portfolio-shell">
          <PortfolioPageHeading index="05 / 06" label="Experience" title="Always in progress." description="Experiences that continue to shape my approach to security work." />
          <div className="portfolio-simple-list">
            {experiences.map((item, index) => (
              <article key={item.title} className="portfolio-list-row portfolio-experience-row">
                <span className="portfolio-list-index">0{index + 1}</span>
                <strong>{item.title}</strong>
                <span>{item.type}<br /><small>{item.detail}</small></span>
                <span className="portfolio-row-mark">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PortfolioFrame>
  );
}
