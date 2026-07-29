"use client";

import { ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollToBottomProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollToBottom({ isVisible, onClick }: ScrollToBottomProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={onClick}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-background border rounded-full text-sm font-medium hover:bg-muted transition-colors shadow-md z-10"
        >
          <ArrowDown className="w-4 h-4" />
          Jump to latest
        </motion.button>
      )}
    </AnimatePresence>
  );
}
