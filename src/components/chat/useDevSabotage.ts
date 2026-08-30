"use client";

import { useCallback, useSyncExternalStore } from "react";

const SABOTAGE_KEY = "dev-sabotage-mode";

type SabotageMode = "off" | "immediate" | "midstream" | "rate-limit" | "malformed";

function getStoredMode(): SabotageMode {
  if (typeof window === "undefined") return "off";
  try {
    return (localStorage.getItem(SABOTAGE_KEY) as SabotageMode) || "off";
  } catch {
    return "off";
  }
}

function subscribe(callback: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === SABOTAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(): SabotageMode {
  return getStoredMode();
}

function getServerSnapshot(): SabotageMode {
  return "off";
}

export function useDevSabotage() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDev = process.env.NODE_ENV === "development";

  const setMode = useCallback((newMode: SabotageMode) => {
    try {
      if (newMode === "off") {
        localStorage.removeItem(SABOTAGE_KEY);
      } else {
        localStorage.setItem(SABOTAGE_KEY, newMode);
      }
      window.dispatchEvent(new StorageEvent("storage", { key: SABOTAGE_KEY }));
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleOff = useCallback(() => setMode("off"), [setMode]);

  return { mode, setMode, toggleOff, isDev };
}
