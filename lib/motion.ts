import type { Transition } from "framer-motion";

export const smoothEase = [0.16, 1, 0.3, 1] as const;

export const revealTransition: Transition = {
  duration: 0.8,
  ease: smoothEase,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 24,
  mass: 0.9,
};

export const softLayoutSpring: Transition = {
  type: "spring",
  stiffness: 210,
  damping: 28,
  mass: 0.85,
};
