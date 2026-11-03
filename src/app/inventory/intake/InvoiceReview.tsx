"use client";

import {useState} from "react";
import {Buttons} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {adjustStock} from "@/app/_services/inventory";
import {searchCatalog} from "@/app/_services/intake.service";
import {IntakeProductType, InvoiceLine, InvoiceMatch} from "@/app/_types/intake";

type ReviewLine = InvoiceLine & {include: boolean; applied: boolean; error: string | null};

const TYPES: IntakeProductType[] = ["beers", "wines", "drinks", "foods"];

function money(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function InvoiceReview({initialLines}: {initialLines: InvoiceLine[]}) {
  const t = useTranslations();
  const [lines, setLines] = useState<ReviewLine[]>(() => initialLines.map((line) => ({
    ...line,
    include: line.match !== null,
    applied: false,
    error: null,
  })));
  const [summary, setSummary] = useState<{applied: number; failed: number} | null>(null);
  const [applying, setApplying] = useState(false);

  function update(index: number, patch: Partial<ReviewLine>) {
    setLines((current) => current.map((line, i) => (i === index ? {...line, ...patch} : line)));
  }

  async function apply() {
    setApplying(true);
    let applied = 0;
    let failed = 0;
    const next = [...lines];
    for (let index = 0; index < next.length; index += 1) {
      const line = next[index];
      if (!line.include || !line.match || line.applied) continue;
      try {
        await adjustStock(line.match.product_type, line.match.id, Math.round(line.quantity), "delivery");
        next[index] = {...line, applied: true, error: null};
        applied += 1;
      } catch (err) {
        next[index] = {...line, error: err instanceof Error ? err.message : t("inventory.loadFailed")};
        failed += 1;
      }
    }
    setLines(next);
    setSummary({applied, failed});
    setApplying(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">{t("intake.review")}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{t("intake.noMatch")}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 pr-3">{t("intake.include")}</th>
              <th className="py-2 pr-3">{t("intake.line")}</th>
              <th className="py-2 pr-3">{t("intake.product")}</th>
              <th className="py-2 pr-3">{t("intake.quantity")}</th>
              <th className="py-2">{t("intake.cost")}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={`${line.description}-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-3">
                  <input
                    type="checkbox"
                    aria-label={t("intake.include")}
                    checked={line.include}
                    disabled={line.applied || !line.match}
                    onChange={(event) => update(index, {include: event.target.checked})}
                  />
                </td>
                <td className="py-2 pr-3">
                  {line.description}
                  {line.source === "ai" && <span className="ml-2 text-xs uppercase">AI</span>}
                </td>
                <td className="py-2 pr-3">
                  <ProductCell
                    line={line}
                    onMatch={(match) => update(index, {match, include: match !== null, applied: false, error: null})}
                  />
                  {line.error && <p className="text-xs text-red-700">{line.error}</p>}
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="number"
                    aria-label={t("intake.quantity")}
                    className="w-24 rounded-lg border px-2 py-1"
                    value={line.quantity}
                    disabled={line.applied}
                    onChange={(event) => update(index, {quantity: Number(event.target.value)})}
                  />
                </td>
                <td className="py-2">{money(line.unit_cost_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Buttons type="button" loading={applying} onClick={() => { void apply(); }}>
        {t("intake.apply")}
      </Buttons>
      {summary && (
        <p>
          {t("intake.applied", {count: summary.applied})} · {t("intake.failed", {count: summary.failed})}
        </p>
      )}
    </div>
  );
}

function ProductCell({line, onMatch}: {line: ReviewLine; onMatch: (match: InvoiceMatch) => void}) {
  const t = useTranslations();
  const [productType, setProductType] = useState<IntakeProductType>(line.match?.product_type ?? "beers");
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<{id: number; name: string}[]>([]);

  async function search() {
    const found = await searchCatalog(productType, query);
    setOptions(found);
  }

  return (
    <div className="space-y-1">
      <p>{line.match ? line.match.name : t("intake.unmatched")}</p>
      <div className="flex gap-2">
        <select
          aria-label={t("intake.product")}
          value={productType}
          onChange={(event) => setProductType(event.target.value as IntakeProductType)}
        >
          {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input
          aria-label={t("intake.search")}
          className="w-32 rounded-lg border px-2 py-1"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="button" className="text-sm underline" onClick={() => { void search(); }}>
          {t("intake.search")}
        </button>
      </div>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="block text-left text-sm underline"
          onClick={() => onMatch({product_type: productType, id: option.id, name: option.name, confidence: "low"})}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
