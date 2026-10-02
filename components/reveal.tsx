"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { revealTransition } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ ...revealTransition, delay }}
      style={{ willChange: "opacity, transform, filter" }}
      animate={{ filter: "blur(0px)" }}
    >
      {children}
    </motion.div>
  );
}
