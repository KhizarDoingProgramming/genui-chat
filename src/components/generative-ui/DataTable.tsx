"use client";

import type { DataTableArgs } from "@/lib/ai/config";
import { cn } from "@/lib/utils";

export function DataTable({ title, columns, rows }: DataTableArgs) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <div className="text-xs text-muted-foreground mb-1">Data Table</div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-border/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-t border-border/30 hover:bg-muted/30 transition-colors",
                  rowIndex % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-2.5 text-sm",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {row[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
