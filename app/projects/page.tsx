import type { Metadata } from "next";

import { PortfolioFrame, PortfolioPageHeading } from "@/components/portfolio-frame";
import { ProjectShowcase } from "@/components/project-showcase";
import { projects } from "@/lib/portfolio-content";

export const metadata: Metadata = { title: "Projects | Niranjan Reddy" };

export default function ProjectsPage() {
  return (
    <PortfolioFrame>
      <section className="portfolio-projects portfolio-section portfolio-inner-page">
        <div className="portfolio-shell">
          <PortfolioPageHeading index="02 / 06" label="Selected work" title="Projects." description="Small, focused builds and simulations that put defensive security concepts to work." />
          <ProjectShowcase projects={projects} />
        </div>
      </section>
    </PortfolioFrame>
  );
}
