"use client";

import Image from "next/image";
import Link from "next/link";
import {Buttons} from "@/app/_components";
import {BRAND_CTA} from "@/app/_components/marketing/brand-styles";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function MarketingHeader() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/50 bg-white/90 backdrop-blur-md dark:border-amber-900/30 dark:bg-surface/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
          <Image src="/marketing/logo-mark.svg" alt="" width={36} height={36} className="h-9 w-9 shrink-0"/>
          <span>{t("common.appName")}</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-amber-100/80 dark:hover:bg-surface-muted"
          >
            {t("marketing.header.signIn")}
          </Link>
          <Link href="/signup">
            <Buttons size="sm" className={`rounded-xl ${BRAND_CTA}`}>
              {t("marketing.header.startFree")}
            </Buttons>
          </Link>
        </nav>
      </div>
    </header>
  );
}
