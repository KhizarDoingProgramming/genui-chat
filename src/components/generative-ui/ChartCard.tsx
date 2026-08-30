"use client";

import type { ChartCardArgs } from "@/lib/ai/config";

const COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#f43f5e", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#06b6d4", "#3b82f6",
];

function BarChart({ data }: { data: ChartCardArgs["data"] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item, i) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-muted-foreground font-medium">{item.value}</span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: item.color || COLORS[i % COLORS.length],
              minHeight: "4px",
            }}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBarChart({ data }: { data: ChartCardArgs["data"] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-24 text-right truncate shrink-0">{item.label}</span>
          <div className="flex-1 h-5 bg-muted/40 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || COLORS[i % COLORS.length],
                minWidth: "20px",
              }}
            >
              <span className="text-[10px] font-medium text-white drop-shadow-sm">{item.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: ChartCardArgs["data"] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  const segments = data.reduce<{ item: ChartCardArgs["data"][number]; percent: number; startPercent: number; color: string }[]>((acc, item, i) => {
    const percent = (item.value / total) * 100;
    const startPercent = acc.length > 0 ? acc[acc.length - 1].startPercent + acc[acc.length - 1].percent : 0;
    acc.push({
      item,
      percent,
      startPercent,
      color: item.color || COLORS[i % COLORS.length],
    });
    return acc;
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const radius = 35;
            const circumference = 2 * Math.PI * radius;
            const dashLength = (seg.percent / 100) * circumference;
            const dashOffset = -(seg.startPercent / 100) * circumference;
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="18"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-700"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {segments.map((seg) => (
          <div key={seg.item.label} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-muted-foreground truncate">{seg.item.label}</span>
            <span className="font-medium ml-auto">{Math.round(seg.percent)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartCard({ title, type, data }: ChartCardArgs) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1">Visualization</div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>

      {type === "bar" && <BarChart data={data} />}
      {type === "horizontal-bar" && <HorizontalBarChart data={data} />}
      {type === "donut" && <DonutChart data={data} />}
    </div>
  );
}
