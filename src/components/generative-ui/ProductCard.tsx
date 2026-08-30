"use client";

import { Star, Tag } from "lucide-react";
import type { ProductCardArgs } from "@/lib/ai/config";

export function ProductCard({ name, description, price, rating, features, category }: ProductCardArgs) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {category && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Tag className="w-3 h-3" />
                <span>{category}</span>
              </div>
            )}
            <h3 className="text-base font-semibold truncate">{name}</h3>
          </div>
          <span className="text-lg font-bold shrink-0">{price}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        {rating !== undefined && (
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating)
                    ? "fill-amber-400 text-amber-400"
                    : i < rating
                    ? "fill-amber-400/50 text-amber-400/50"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
          </div>
        )}

        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/50 text-xs text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
