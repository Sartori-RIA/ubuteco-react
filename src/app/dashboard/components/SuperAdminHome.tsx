"use client";

import Link from "next/link";
import {Card} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function SuperAdminHome() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("dashboard.platform.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("dashboard.platform.subtitle")}</p>
      </div>
      <Card title={t("dashboard.platform.organizationsTitle")} className="hover:translate-y-0">
        <p className="mb-4 text-sm text-muted">{t("dashboard.platform.organizationsHint")}</p>
        <Link
          href="/organizations"
          className="inline-flex rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
        >
          {t("dashboard.platform.openOrganizations")}
        </Link>
      </Card>
    </div>
  );
}
