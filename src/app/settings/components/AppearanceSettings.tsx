"use client";

import {AppearanceMode} from "@/app/_lib/appearance";
import {useAppearance} from "@/app/_components/AppearanceProvider";

const OPTIONS: {value: AppearanceMode; label: string; description: string}[] = [
  {value: "light", label: "Light", description: "Always use light mode"},
  {value: "dark", label: "Dark", description: "Always use dark mode"},
  {value: "system", label: "System", description: "Match your device setting"},
];

export function AppearanceSettings() {
  const {mode, setMode} = useAppearance();

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {OPTIONS.map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={`rounded-xl border p-4 text-left transition ${
              active
                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
                : "border-border bg-surface hover:bg-surface-muted"
            }`}
          >
            <span className="block text-sm font-semibold text-foreground">{option.label}</span>
            <span className="mt-1 block text-xs text-muted">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
