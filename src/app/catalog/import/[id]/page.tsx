"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {ImportStatusPanel} from "@/app/catalog/import/components/ImportStatusPanel";
import {CatalogImport, getImport, shouldPoll} from "@/app/_services/catalog-import.service";

export default function CatalogImportDetailPage() {
  const params = useParams<{id: string}>();
  const t = useTranslations();
  const [record, setRecord] = useState<CatalogImport | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    const id = Number(params.id);

    async function load() {
      const next = await getImport(id);
      if (cancelled) return;
      setRecord(next);
      if (!shouldPoll(next.status) && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    load();
    timer = setInterval(load, 3000);

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [params.id]);

  if (!record) return <p className="p-6">{t("common.loading")}</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{t("catalogImport.detailTitle")}</h1>
      <ImportStatusPanel record={record} t={t}/>
    </div>
  );
}
