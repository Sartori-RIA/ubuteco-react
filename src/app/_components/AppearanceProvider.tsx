"use client";

import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {
  AppearanceMode,
  applyAppearance,
  readStoredAppearance,
  storeAppearance,
} from "@/app/_lib/appearance";

type AppearanceContextValue = {
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => void;
  isDark: boolean;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function readInitialMode(): AppearanceMode {
  if (typeof window === "undefined") return "system";
  return readStoredAppearance();
}

export function AppearanceProvider({children}: {children: ReactNode}) {
  const [mode, setModeState] = useState<AppearanceMode>(readInitialMode);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = readStoredAppearance();
    setModeState(stored);
    applyAppearance(stored);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    applyAppearance(mode);
    setIsDark(document.documentElement.classList.contains("dark"));

    if (mode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => {
      applyAppearance("system");
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    media.addEventListener("change", syncSystem);
    return () => media.removeEventListener("change", syncSystem);
  }, [mode]);

  const setMode = (next: AppearanceMode) => {
    setModeState(next);
    storeAppearance(next);
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  const value = useMemo(() => ({mode, setMode, isDark}), [mode, isDark]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}
