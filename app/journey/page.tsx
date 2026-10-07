import type { Metadata } from "next";

import { PortfolioFrame, PortfolioPageHeading } from "@/components/portfolio-frame";
import { journeySteps } from "@/lib/portfolio-content";

export const metadata: Metadata = { title: "Journey | Niranjan Reddy" };

export default function JourneyPage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-journey portfolio-section portfolio-inner-page">
        <div className="portfolio-shell">
          <PortfolioPageHeading index="06 / 06" label="Journey" title="My academic journey." />
          <div className="portfolio-journey-track">
            {journeySteps.map((step, index) => (
              <article className="portfolio-journey-step" key={step.phase}>
                <span className="portfolio-journey-index">0{index + 1}</span>
                <span className="portfolio-journey-phase">{step.phase}</span>
                <div><h3>{step.title}</h3><p>{step.detail}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PortfolioFrame>
  );
}
