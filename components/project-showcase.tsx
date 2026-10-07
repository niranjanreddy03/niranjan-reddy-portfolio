import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type Project = {
  title: string;
  description: string;
  stack: string[];
  category: string;
  githubHref?: string;
};

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="portfolio-project-list">
      {projects.map((project, index) => (
        <article className="portfolio-project-row" key={project.title}>
          <span className="portfolio-project-number">0{index + 1}</span>
          <div className="portfolio-project-main">
            <span className="portfolio-project-category">{project.category}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="portfolio-project-tags">
              {project.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          {project.githubHref && (
            <Link
              href={project.githubHref}
              target="_blank"
              rel="noreferrer"
              className="portfolio-project-open"
              aria-label={`View ${project.title} on GitHub`}
            >
              <ArrowUpRight size={24} strokeWidth={1.5} />
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
