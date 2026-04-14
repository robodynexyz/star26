"use client";

import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="py-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold tracking-tight md:text-7xl"
      >
        STAR26
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-4 text-lg text-zinc-400"
      >
        World Cup 2026 — pick the winner, climb the leaderboard.
      </motion.p>
    </section>
  );
}
