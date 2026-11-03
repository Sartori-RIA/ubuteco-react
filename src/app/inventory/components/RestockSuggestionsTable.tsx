"use client";

import {useState} from "react";
import {StockAdjustmentPanel} from "@/app/_components/StockAdjustmentPanel";
import {useToast} from "@/app/_components/Toast/ToastProvider";
import type {TranslateFn} from "@/app/_lib/i18n";
import type {TranslationKey} from "@/app/_lib/i18n";
import {RestockSuggestion, StockableProductType} from "@/app/_services/inventory";

const PRODUCT_TYPE_LABEL: Record<StockableProductType, TranslationKey> = {
  beers: "nav.beers",
  wines: "nav.wines",
  drinks: "nav.drinks",
  foods: "nav.foods",
};

const COVER_OPTIONS = [3, 7, 14, 30];

type Props = {
  items: RestockSuggestion[];
  coverDays: number;
  onCoverDaysChange: (days: number) => void;
  showExplain: boolean;
  explain: boolean;
  onExplainChange: (next: boolean) => void;
  explainError?: string | null;
  onAdjusted: () => void;
  t: TranslateFn;
};

export function RestockSuggestionsTable({
  items,
  coverDays,
  onCoverDaysChange,
  showExplain,
  explain,
  onExplainChange,
  explainError,
  onAdjusted,
  t,
}: Props) {
  const {showToast} = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((item) => rowKey(item) === selectedId) ?? null;

  async function copyList() {
    const lines = items
      .filter((item) => (item.suggested_quantity ?? 0) > 0)
      .map((item) => `${item.name} — ${item.suggested_quantity}`);
    const text = [t("inventory.restock.copyHeader"), ...lines].join("\n");
    await navigator.clipboard.writeText(text);
    showToast(t("inventory.restock.copied"));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          {t("inventory.restock.coverDays")}
          <select
            aria-label={t("inventory.restock.coverDays")}
            className="rounded-md border border-gray-300 bg-surface px-2 py-1 dark:border-gray-600"
            value={coverDays}
            onChange={(event) => onCoverDaysChange(Number(event.target.value))}
          >
            {COVER_OPTIONS.map((days) => (
              <option key={days} value={days}>{days}</option>
            ))}
          </select>
        </label>

        {showExplain && (
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              role="switch"
              checked={explain}
              aria-label={t("inventory.restock.explain")}
              onChange={(event) => onExplainChange(event.target.checked)}
            />
            {t("inventory.restock.explain")}
          </label>
        )}

        <button
          type="button"
          onClick={() => void copyList()}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {t("inventory.restock.copyList")}
        </button>
      </div>

      {explainError && (
        <p className="text-sm text-amber-700 dark:text-amber-300">{explainError}</p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("inventory.restock.empty")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-2 font-medium">{t("inventory.columnProduct")}</th>
                <th className="px-3 py-2 font-medium">{t("inventory.columnType")}</th>
                <th className="px-3 py-2 font-medium">{t("inventory.columnStock")}</th>
                <th className="px-3 py-2 font-medium">{t("inventory.restock.columnAvg")}</th>
                <th className="px-3 py-2 font-medium">{t("inventory.restock.columnDays")}</th>
                <th className="px-3 py-2 font-medium">{t("inventory.restock.columnSuggested")}</th>
                <th className="px-3 py-2 font-medium"/>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = item.confidence === "low";
                return (
                  <tr key={rowKey(item)} className="border-b border-gray-100 dark:border-gray-800">
                    <td className={`px-3 py-3 font-medium ${low ? "text-gray-400" : ""}`}>
                      {item.name}
                      {item.explanation && (
                        <p className="mt-1 text-xs font-normal text-gray-500">
                          <span className="mr-1 rounded bg-gray-200 px-1 py-0.5 text-[10px] uppercase dark:bg-gray-700">
                            {t("inventory.restock.aiBadge")}
                          </span>
                          {item.explanation}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-400">
                      {t(PRODUCT_TYPE_LABEL[item.product_type])}
                    </td>
                    <td className="px-3 py-3">{item.quantity_stock}</td>
                    <td className="px-3 py-3">{item.avg_daily}</td>
                    <td className="px-3 py-3">{item.days_of_cover ?? "—"}</td>
                    <td className={`px-3 py-3 ${low ? "text-gray-400" : ""}`}>
                      {low || item.suggested_quantity == null
                        ? t("inventory.restock.lowConfidence")
                        : item.suggested_quantity}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {!low && item.suggested_quantity != null && (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                          onClick={() => setSelectedId(rowKey(item))}
                        >
                          {t("inventory.restock.adjust")}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && selected.suggested_quantity != null && (
        <StockAdjustmentPanel
          key={rowKey(selected)}
          productType={selected.product_type}
          productId={selected.id}
          quantityStock={selected.quantity_stock}
          initialAdjustment={String(selected.suggested_quantity)}
          initialReason="delivery"
          onStockChanged={onAdjusted}
        />
      )}
    </div>
  );
}

function rowKey(item: RestockSuggestion): string {
  return `${item.product_type}-${item.id}`;
}
