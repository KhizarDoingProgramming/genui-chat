"use client";

import { motion } from "framer-motion";
import { z } from "zod";
import {
  weatherCardSchema,
  statsCardSchema,
  dataTableSchema,
  chartCardSchema,
  productCardSchema,
} from "@/lib/ai/config";
import { WeatherCard } from "./WeatherCard";
import { StatsCard } from "./StatsCard";
import { DataTable } from "./DataTable";
import { ChartCard } from "./ChartCard";
import { ProductCard } from "./ProductCard";
import { AlertTriangle } from "lucide-react";

interface ToolInvocation {
  type: "tool-invocation";
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
  result?: unknown;
}

const schemas = {
  generateWeatherCard: weatherCardSchema,
  generateStatsCard: statsCardSchema,
  generateDataTable: dataTableSchema,
  generateChart: chartCardSchema,
  generateProductCard: productCardSchema,
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function ValidationError({ toolName }: { toolName: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>Failed to render {toolName} — invalid data from model.</span>
    </div>
  );
}

function UnknownTool({ toolName }: { toolName: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border text-muted-foreground text-sm">
      <span>Tool &quot;{toolName}&quot; is not supported yet.</span>
    </div>
  );
}

function PendingTool({ toolName }: { toolName: string }) {
  const label = toolName.replace("generate", "").replace(/([A-Z])/g, " $1").trim();
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 animate-pulse">
      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground/80 animate-spin" />
      <span className="text-sm text-muted-foreground">Generating {label}...</span>
    </div>
  );
}

function ToolResult({ invocation }: { invocation: ToolInvocation }) {
  const { toolName, args } = invocation;
  const schema = schemas[toolName as keyof typeof schemas];

  if (!schema) {
    return <UnknownTool toolName={toolName} />;
  }

  const parsed = schema.safeParse(args);
  if (!parsed.success) {
    console.error(`Tool validation failed for ${toolName}:`, parsed.error);
    return <ValidationError toolName={toolName} />;
  }

  switch (toolName) {
    case "generateWeatherCard":
      return <WeatherCard {...parsed.data as z.infer<typeof weatherCardSchema>} />;
    case "generateStatsCard":
      return <StatsCard {...parsed.data as z.infer<typeof statsCardSchema>} />;
    case "generateDataTable":
      return <DataTable {...parsed.data as z.infer<typeof dataTableSchema>} />;
    case "generateChart":
      return <ChartCard {...parsed.data as z.infer<typeof chartCardSchema>} />;
    case "generateProductCard":
      return <ProductCard {...parsed.data as z.infer<typeof productCardSchema>} />;
    default:
      return <UnknownTool toolName={toolName} />;
  }
}

export function UIGuard({ invocation }: { invocation: ToolInvocation }) {
  const { state, toolName } = invocation;

  if (state === "call" || state === "partial-call") {
    return <PendingTool toolName={toolName} />;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <ToolResult invocation={invocation} />
    </motion.div>
  );
}
