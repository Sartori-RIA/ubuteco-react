"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {AppearanceMode, applyAppearance} from "@/app/_lib/appearance";
import {
  getAppearanceServerSnapshot,
  getAppearanceSnapshot,
  getSystemColorSchemeServerSnapshot,
  getSystemColorSchemeSnapshot,
  setAppearanceMode,
  subscribeAppearance,
  subscribeSystemColorScheme,
} from "@/app/_lib/appearance-store";

type AppearanceContextValue = {
  mode: AppearanceMode;
  setMode: (mode: AppearanceMode) => void;
  isDark: boolean;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({children}: {children: ReactNode}) {
  const mode = useSyncExternalStore(
    subscribeAppearance,
    getAppearanceSnapshot,
    getAppearanceServerSnapshot
  );
  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemColorScheme,
    getSystemColorSchemeSnapshot,
    getSystemColorSchemeServerSnapshot
  );
  const isDark = mode === "dark" || (mode === "system" && systemPrefersDark);

  useEffect(() => {
    applyAppearance(mode);
  }, [mode, systemPrefersDark]);

  const setMode = useCallback((next: AppearanceMode) => {
    setAppearanceMode(next);
  }, []);

  const value = useMemo(() => ({mode, setMode, isDark}), [mode, setMode, isDark]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }
  return context;
}
