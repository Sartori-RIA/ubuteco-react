export type AppearanceMode = "light" | "dark" | "system";

export const APPEARANCE_STORAGE_KEY = "ubuteco-appearance";

export function resolveDarkMode(mode: AppearanceMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function readStoredAppearance(): AppearanceMode {
  if (typeof window === "undefined") return "system";
  const value = localStorage.getItem(APPEARANCE_STORAGE_KEY);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export function applyAppearance(mode: AppearanceMode): void {
  const root = document.documentElement;
  root.classList.toggle("dark", resolveDarkMode(mode));
  root.dataset.appearance = mode;
}

export function storeAppearance(mode: AppearanceMode): void {
  localStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
  applyAppearance(mode);
}
