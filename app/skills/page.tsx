import type { Metadata } from "next";

import { PortfolioFrame, PortfolioPageHeading } from "@/components/portfolio-frame";
import { capabilities } from "@/lib/portfolio-content";

export const metadata: Metadata = { title: "Capabilities | Niranjan Reddy" };

export default function SkillsPage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-skills portfolio-section portfolio-inner-page">
        <div className="portfolio-shell">
          <PortfolioPageHeading index="03 / 06" label="Capabilities" title="What I work on." description="The skills and tools I&apos;m actively developing through practice." />
          <div className="portfolio-capabilities">
            {capabilities.map((item) => (
              <article className="portfolio-capability" key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <small>{item.tools}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PortfolioFrame>
  );
}
