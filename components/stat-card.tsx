"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const numericValue = Number.parseInt(value, 10);
  const suffix = value.replace(String(numericValue), "");
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      motionValue.set(numericValue);
    }
  }, [inView, motionValue, numericValue]);

  useEffect(() => {
    return spring.on("change", (latest) => setDisplay(Math.round(latest)));
  }, [spring]);

  return (
    <motion.div ref={ref} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}>
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl">
            {display}
            {suffix}
          </CardTitle>
          <CardDescription>{label}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
