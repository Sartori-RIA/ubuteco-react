"use client";

import Link from "next/link";
import {Buttons} from "@/app/_components";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function MarketingHeader() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          {t("common.appName")}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
          >
            {t("marketing.header.signIn")}
          </Link>
          <Link href="/signup">
            <Buttons size="sm" className="rounded-xl">
              {t("marketing.header.startFree")}
            </Buttons>
          </Link>
        </nav>
      </div>
    </header>
  );
}
