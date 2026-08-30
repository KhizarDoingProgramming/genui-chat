"use client";

import { Cloud, Droplets, Wind, Sun, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";
import type { WeatherCardArgs } from "@/lib/ai/config";
import { cn } from "@/lib/utils";

const conditionIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: CloudSnow,
  windy: Wind,
  foggy: CloudFog,
} as const;

const conditionColors = {
  sunny: "text-amber-500",
  cloudy: "text-zinc-400",
  rainy: "text-blue-500",
  stormy: "text-purple-500",
  snowy: "text-sky-300",
  windy: "text-teal-500",
  foggy: "text-zinc-400",
} as const;

export function WeatherCard({ city, temperature, condition, humidity, windSpeed, forecast }: WeatherCardArgs) {
  const Icon = conditionIcons[condition];
  const iconColor = conditionColors[condition];

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-5 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      
      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Cloud className="w-3 h-3" />
            <span>Weather</span>
          </div>
          <h3 className="text-lg font-semibold">{city}</h3>
        </div>
        <Icon className={cn("w-10 h-10", iconColor)} strokeWidth={1.5} />
      </div>

      <div className="flex items-end gap-1 mb-4 relative">
        <span className="text-4xl font-bold tracking-tight">{temperature}</span>
        <span className="text-lg text-muted-foreground mb-1">°C</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 relative">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5" />
          <span>{humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5" />
          <span>{windSpeed} km/h</span>
        </div>
        <span className="capitalize">{condition}</span>
      </div>

      {forecast && forecast.length > 0 && (
        <div className="relative border-t border-border/40 pt-3">
          <div className="flex gap-3">
            {forecast.map((day) => {
              const DayIcon = conditionIcons[day.condition];
              const dayColor = conditionColors[day.condition];
              return (
                <div key={day.day} className="flex-1 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                  <DayIcon className={cn("w-4 h-4 mx-auto mb-1", dayColor)} strokeWidth={1.5} />
                  <p className="text-xs">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-muted-foreground"> / {day.low}°</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
