"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { GitHubIcon } from "@/components/brand-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { smoothEase, softLayoutSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Project = {
  title: string;
  description: string;
  stack: string[];
  category: string;
  githubHref?: string;
};

type ProjectShowcaseProps = {
  projects: Project[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  );
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0",
              activeCategory === category
                ? "border-accent bg-accent-soft text-foreground"
                : "border-border bg-white/[0.03] text-muted hover:border-accent/60 hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div layout transition={softLayoutSpring} className="mt-8 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.title}
              layout
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.98 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.18 }
                  : { layout: softLayoutSpring, opacity: { duration: 0.32, ease: smoothEase }, y: softLayoutSpring, scale: softLayoutSpring }
              }
            >
              <Card className="group h-full transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.05] hover:shadow-[0_22px_60px_rgba(0,0,0,0.25)]">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-4">
                    {project.title}
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-wrap gap-2">
                    <Badge className="border-accent/40 text-accent">
                      {project.category}
                    </Badge>
                    {project.stack.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                  {project.githubHref ? (
                    <div className="flex flex-wrap gap-3">
                      <Button asChild variant="secondary" size="sm" className="gap-2">
                        <Link
                          href={project.githubHref}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GitHubIcon className="h-4 w-4" />
                          GitHub
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
