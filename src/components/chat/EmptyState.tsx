"use client";

import { Sparkles, Code, BarChart3, Cloud } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onExampleClick: (prompt: string) => void;
}

const examples = [
  {
    icon: Code,
    text: "Show me the top programming languages.",
  },
  {
    icon: BarChart3,
    text: "Create a chart of monthly sales.",
  },
  {
    icon: Sparkles,
    text: "Compare React and Vue.",
  },
  {
    icon: Cloud,
    text: "What's the weather in Tokyo?",
  },
];

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-md"
      >
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Ask me anything, or try one of these examples to see what I can do.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {examples.map((example, i) => {
            const Icon = example.icon;
            return (
              <motion.button
                key={example.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                onClick={() => onExampleClick(example.text)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:bg-accent/50 text-left text-sm transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {example.text}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
