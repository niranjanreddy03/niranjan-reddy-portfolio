"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

type TimelineItem = {
  title: string;
  description: string;
  detail: string;
};

type InteractiveTimelineProps = {
  items: TimelineItem[];
};

export function InteractiveTimeline({ items }: InteractiveTimelineProps) {
  const [openItem, setOpenItem] = useState(items[0]?.title);

  return (
    <div className="mt-12 space-y-4 border-l border-border pl-6">
      {items.map((item) => {
        const isOpen = openItem === item.title;

        return (
          <div key={item.title} className="relative">
            <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full border border-accent bg-background" />
            <button
              type="button"
              onClick={() => setOpenItem(isOpen ? "" : item.title)}
              className="flex w-full items-start justify-between gap-4 rounded-lg border border-border bg-white/[0.025] p-4 text-left transition-colors hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <span>
                <span className="block text-lg font-semibold tracking-tight">
                  {item.title}
                </span>
                <span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">
                  {item.description}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "mt-1 h-5 w-5 shrink-0 text-muted transition-transform",
                  isOpen && "rotate-180 text-accent",
                )}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 pt-3 text-sm leading-6 text-slate-300">
                    {item.detail}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
