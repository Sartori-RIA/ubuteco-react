"use client";

import {AppearanceMode} from "@/app/_lib/appearance";
import {useAppearance} from "@/app/_components/AppearanceProvider";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {TranslationKey} from "@/app/_lib/i18n";

const OPTIONS: {value: AppearanceMode; labelKey: TranslationKey; descKey: TranslationKey}[] = [
  {value: "light", labelKey: "appearance.light", descKey: "appearance.lightDesc"},
  {value: "dark", labelKey: "appearance.dark", descKey: "appearance.darkDesc"},
  {value: "system", labelKey: "appearance.system", descKey: "appearance.systemDesc"},
];

export function AppearanceSettings() {
  const {mode, setMode} = useAppearance();
  const t = useTranslations();

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
            <span className="block text-sm font-semibold text-foreground">{t(option.labelKey)}</span>
            <span className="mt-1 block text-xs text-muted">{t(option.descKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
