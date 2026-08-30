"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ErrorBannerProps {
  error: Error | undefined;
  isRetrying: boolean;
  hasPartialContent: boolean;
  onRetry: () => void;
}

function getErrorMessage(error: Error): { title: string; description: string } {
  const message = error?.message || "";

  if (message.includes("429") || message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("too many")) {
    return {
      title: "Service is busy",
      description: "The AI service is temporarily rate-limited. Please try again in a moment.",
    };
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("network")) {
    return {
      title: "Connection lost",
      description: "Unable to reach the server. Check your internet connection and try again.",
    };
  }

  if (message.includes("500") || message.includes("502") || message.includes("503")) {
    return {
      title: "Server error",
      description: "The server encountered an issue. This is temporary — please try again.",
    };
  }

  if (message.includes("400") || message.includes("invalid")) {
    return {
      title: "Invalid request",
      description: "The request could not be processed. Please try rephrasing your message.",
    };
  }

  return {
    title: "Something went wrong",
    description: "An error occurred while generating the response.",
  };
}

export function ErrorBanner({ error, isRetrying, hasPartialContent, onRetry }: ErrorBannerProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-3 overflow-hidden"
        >
          <div className={cn(
            "flex items-start gap-3 p-3 rounded-xl border shadow-sm",
            hasPartialContent
              ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50"
              : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50"
          )}>
            <AlertCircle className={cn(
              "w-4 h-4 shrink-0 mt-0.5",
              hasPartialContent
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
            )} />
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                hasPartialContent
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-red-800 dark:text-red-200"
              )}>
                {getErrorMessage(error).title}
              </p>
              <p className={cn(
                "text-xs mt-0.5",
                hasPartialContent
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
              )}>
                {hasPartialContent
                  ? "Generation was interrupted. The partial response has been preserved."
                  : getErrorMessage(error).description}
              </p>
            </div>
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0",
                hasPartialContent
                  ? "bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300"
                  : "bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-red-700 dark:text-red-300",
                isRetrying && "opacity-50 cursor-not-allowed"
              )}
              aria-label={isRetrying ? "Retrying..." : "Retry generation"}
            >
              <RefreshCw className={cn("w-3 h-3", isRetrying && "animate-spin")} />
              {isRetrying ? "Retrying..." : "Retry"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
