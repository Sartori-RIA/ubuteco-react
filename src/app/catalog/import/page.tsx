"use client";

import Link from "next/link";
import {FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Buttons} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {
  CatalogImport,
  createImport,
  downloadTemplate,
  ImportFileError,
  ImportInProgressError,
  listImports,
} from "@/app/_services/catalog-import.service";
import {importListStatus} from "@/app/catalog/import/components/ImportStatusPanel";

const TYPES = ["beer", "drink", "wine", "food", "dish"] as const;

const TYPE_KEYS = {
  beer: "catalogImport.types.beer",
  drink: "catalogImport.types.drink",
  wine: "catalogImport.types.wine",
  food: "catalogImport.types.food",
  dish: "catalogImport.types.dish",
} as const;

const COLUMNS: Record<(typeof TYPES)[number], string> = {
  beer: "name, price, ibu, quantity_stock, abv, maker, beer_style, description, valid_until",
  drink: "name, price, quantity_stock, description, flavor",
  wine: "name, price, abv, description, vintage_wine, visual, ripening, grapes, maker, wine_style, quantity_stock",
  food: "name, price, quantity_stock, valid_until",
  dish: "name, price, ingredients",
};

export default function CatalogImportPage() {
  const t = useTranslations();
  const router = useRouter();
  const [productType, setProductType] = useState<(typeof TYPES)[number]>("beer");
  const [file, setFile] = useState<File | null>(null);
  const [imports, setImports] = useState<CatalogImport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listImports().then(setImports).catch(() => setImports([]));
  }, []);

  const blocked = imports.some((item) => item.status === "queued" || item.status === "running");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setError(null);
    setBusyId(null);
    setSubmitting(true);
    try {
      const created = await createImport(file, productType);
      router.push(`/catalog/import/${created.id}`);
    } catch (err) {
      if (err instanceof ImportFileError) {
        setError(err.code === "too_large" ? t("catalogImport.tooLarge") : t("catalogImport.notCsv"));
      } else if (err instanceof ImportInProgressError) {
        setBusyId(err.id);
        setError(t("catalogImport.busy"));
      } else {
        setError(t("api.errors.generic"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">{t("catalogImport.title")}</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span>{t("catalogImport.type")}</span>
          <select
            className="mt-1 w-full rounded-xl border border-border bg-surface p-2"
            value={productType}
            onChange={(event) => setProductType(event.target.value as (typeof TYPES)[number])}
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>{t(TYPE_KEYS[type])}</option>
            ))}
          </select>
        </label>
        <p className="text-sm text-foreground/70">{t("catalogImport.headers", {columns: COLUMNS[productType]})}</p>
        <Buttons type="button" variant="outline" onClick={() => downloadTemplate(productType)}>
          {t("catalogImport.template")}
        </Buttons>
        <label className="block">
          <span className="block">{t("catalogImport.file")}</span>
          <span className="mt-1 inline-flex h-10 cursor-pointer items-center rounded-2xl border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-muted">
            <input
              className="sr-only"
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file ? file.name : t("catalogImport.chooseFile")}
          </span>
        </label>
        {error ? <p role="alert">{error}</p> : null}
        {busyId ? (
          <p>
            <Link href={`/catalog/import/${busyId}`}>{t("catalogImport.openRunning")}</Link>
          </p>
        ) : null}
        <Buttons type="submit" loading={submitting} disabled={blocked || !file}>
          {t("catalogImport.submit")}
        </Buttons>
      </form>
      <section>
        <h2 className="mb-2 text-lg font-semibold">{t("catalogImport.recent")}</h2>
        {imports.length === 0 ? <p>{t("catalogImport.empty")}</p> : (
          <ul>
            {imports.map((item) => (
              <li key={item.id}>
                <Link href={`/catalog/import/${item.id}`}>
                  {t(TYPE_KEYS[item.product_type as (typeof TYPES)[number]] ?? TYPE_KEYS.beer)} · {importListStatus(item, t)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
