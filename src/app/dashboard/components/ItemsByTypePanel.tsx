"use client";

import {Card} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  itemsByType: Record<string, number> | undefined;
};

const TYPE_LABELS: Record<string, string> = {
  Beer: "Beer",
  Dish: "Dish",
  Drink: "Drink",
  Food: "Food",
  Wine: "Wine",
};

export function ItemsByTypePanel({itemsByType}: Props) {
  const t = useTranslations();
  const entries = Object.entries(itemsByType ?? {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, value]) => value), 1);

  return (
    <Card title={t("dashboard.itemsByType.title")} className="hover:translate-y-0">
      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t("dashboard.itemsByType.empty")}</p>
      ) : (
        <ul className="space-y-3">
          {entries.map(([type, quantity]) => (
            <li key={type}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{TYPE_LABELS[type] ?? type}</span>
                <span className="text-muted">{quantity}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-muted">
                <div
                  className="h-2 rounded-full bg-emerald-500/80"
                  style={{width: `${(quantity / max) * 100}%`}}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
