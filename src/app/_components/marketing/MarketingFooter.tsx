"use client";

import Link from "next/link";
import {useTranslations} from "@/app/_hooks/useTranslations";

export function MarketingFooter() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">{t("marketing.footer.tagline")}</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <Link href="/login" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400">
            {t("marketing.footer.signIn")}
          </Link>
          <Link href="/signup" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400">
            {t("marketing.footer.signUp")}
          </Link>
          <Link href="/terms" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400">
            {t("marketing.footer.terms")}
          </Link>
          <Link href="/privacy" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400">
            {t("marketing.footer.privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
