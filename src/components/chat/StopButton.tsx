"use client";

import { Square } from "lucide-react";
import { motion } from "framer-motion";

interface StopButtonProps {
  onClick: () => void;
}

export function StopButton({ onClick }: StopButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-background border rounded-full text-sm font-medium hover:bg-muted transition-colors shadow-sm"
    >
      <Square className="w-4 h-4 fill-foreground" />
      Stop generating
    </motion.button>
  );
}
