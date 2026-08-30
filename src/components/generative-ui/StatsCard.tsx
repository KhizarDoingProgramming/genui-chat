"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatsCardArgs } from "@/lib/ai/config";
import { cn } from "@/lib/utils";

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
} as const;

const trendColors = {
  up: "text-emerald-500",
  down: "text-red-500",
  neutral: "text-muted-foreground",
} as const;

export function StatsCard({ title, description, stats }: StatsCardArgs) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1">Statistics</div>
        <h3 className="text-base font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const TrendIcon = stat.trend ? trendIcons[stat.trend] : null;
          const trendColor = stat.trend ? trendColors[stat.trend] : null;
          return (
            <div
              key={stat.label}
              className="rounded-xl bg-muted/40 p-3"
            >
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold tracking-tight">{stat.value}</span>
                {stat.change !== undefined && TrendIcon && (
                  <span className={cn("flex items-center gap-0.5 text-xs font-medium mb-0.5", trendColor)}>
                    <TrendIcon className="w-3 h-3" />
                    {stat.change > 0 ? "+" : ""}{stat.change}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
