import {
  AppearanceMode,
  readStoredAppearance,
  storeAppearance,
} from "@/app/_lib/appearance";

const appearanceListeners = new Set<() => void>();

export function subscribeAppearance(listener: () => void): () => void {
  appearanceListeners.add(listener);
  return () => appearanceListeners.delete(listener);
}

export function getAppearanceSnapshot(): AppearanceMode {
  return readStoredAppearance();
}

export function getAppearanceServerSnapshot(): AppearanceMode {
  return "system";
}

export function setAppearanceMode(mode: AppearanceMode): void {
  storeAppearance(mode);
  appearanceListeners.forEach((listener) => listener());
}

export function subscribeSystemColorScheme(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

export function getSystemColorSchemeSnapshot(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getSystemColorSchemeServerSnapshot(): boolean {
  return false;
}
