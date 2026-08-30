"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Zap, WifiOff, Clock, FileWarning, X } from "lucide-react";
import { useDevSabotage } from "./useDevSabotage";
import { cn } from "@/lib/utils";

const SABOTAGE_OPTIONS = [
  { value: "off" as const, label: "Off", icon: X, description: "No sabotage" },
  { value: "immediate" as const, label: "API Failure", icon: Zap, description: "500 error immediately" },
  { value: "midstream" as const, label: "Mid-Stream", icon: WifiOff, description: "Fail during streaming" },
  { value: "rate-limit" as const, label: "Rate Limit", icon: Clock, description: "429 error" },
  { value: "malformed" as const, label: "Bad Data", icon: FileWarning, description: "Invalid tool data" },
];

export function DevSabotagePanel() {
  const { mode, setMode, isDev } = useDevSabotage();
  const [isOpen, setIsOpen] = useState(false);

  if (!isDev) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mb-2 bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 rounded-xl p-3 shadow-2xl w-64"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-300">Sabotage Mode</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Close sabotage panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {SABOTAGE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = mode === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors",
                      isActive
                        ? "bg-red-600/20 text-red-300 border border-red-600/30"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </div>
                    {isActive && <span className="text-[10px] font-bold">ON</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-lg transition-colors",
          mode !== "off"
            ? "bg-red-600 text-white border-red-500 hover:bg-red-500"
            : "bg-zinc-900 dark:bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200"
        )}
        aria-label="Toggle sabotage panel"
      >
        <AlertTriangle className="w-3 h-3" />
        {mode !== "off" ? "SABOTAGE ON" : "Dev Tools"}
      </button>
    </div>
  );
}
