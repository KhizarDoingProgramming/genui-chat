"use client";

import { motion } from "framer-motion";

export function ThinkingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 p-4 bg-muted/30 rounded-2xl w-fit">
      <span className="text-sm text-muted-foreground mr-1">AI is thinking</span>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
          animate={{
            y: ["0%", "-50%", "0%"],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
