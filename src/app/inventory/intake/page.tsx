"use client";

import Link from "next/link";
import {useState} from "react";
import {Card} from "@/app/_components";
import {useAiEnabled} from "@/app/_hooks/useAiEnabled";
import {useTranslations} from "@/app/_hooks/useTranslations";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import {ApiError} from "@/app/_services/api-fetch";
import {intakeFileError, parseInvoice} from "@/app/_services/intake.service";
import {InvoiceLine} from "@/app/_types/intake";
import {InvoiceReview} from "@/app/inventory/intake/InvoiceReview";

export default function Page() {
  const t = useTranslations();
  const aiEnabled = useAiEnabled();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<InvoiceLine[] | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const code = intakeFileError(file, "invoice");
    if (code) {
      setError(t(`intake.${code}`));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = await parseInvoice(file);
      setLines(payload.lines);
    } catch (err) {
      const messages = resolveApiErrorMessages(err instanceof ApiError ? {errors: err.items} : err, t);
      setError(messages[0] ?? t("api.errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t("intake.title")}</h1>
        <Link href="/inventory" className="text-sm underline">{t("intake.back")}</Link>
      </div>
      <Card title={t("intake.uploadXml")}>
        <div className="space-y-3">
          <input
            type="file"
            accept={aiEnabled ? ".xml,application/xml,text/xml,image/*,application/pdf" : ".xml,application/xml,text/xml"}
            aria-label={aiEnabled ? t("intake.uploadPhoto") : t("intake.uploadXml")}
            onChange={(event) => { void onFile(event.target.files?.[0]); }}
          />
          {aiEnabled && <p className="text-xs text-gray-500">{t("intake.uploadPhoto")}</p>}
          {loading && <p>{t("intake.working")}</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </Card>
      {lines && <InvoiceReview key={lines.map((line) => line.description).join("|")} initialLines={lines}/>}
    </div>
  );
}
