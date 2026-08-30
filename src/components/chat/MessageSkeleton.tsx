"use client";

import { motion } from "framer-motion";

export function MessageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex py-4 md:py-6 justify-start"
    >
      <div className="flex max-w-[85%] md:max-w-[75%] flex-row">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 mr-4 bg-white dark:bg-zinc-900 mt-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-900 dark:text-zinc-100"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 bg-muted rounded-full animate-pulse" style={{ width: "80px" }} />
            <div className="h-3 bg-muted rounded-full animate-pulse" style={{ width: "120px", animationDelay: "0.15s" }} />
          </div>
          <div className="flex gap-1.5">
            <div className="h-3 bg-muted rounded-full animate-pulse" style={{ width: "140px", animationDelay: "0.3s" }} />
            <div className="h-3 bg-muted rounded-full animate-pulse" style={{ width: "60px", animationDelay: "0.45s" }} />
          </div>
          <div className="h-3 bg-muted rounded-full animate-pulse mt-1" style={{ width: "100px", animationDelay: "0.6s" }} />
        </div>
      </div>
    </motion.div>
  );
}
