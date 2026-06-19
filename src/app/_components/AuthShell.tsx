"use client";

import Image from "next/image";
import Link from "next/link";
import {ReactNode} from "react";
import {AMBIENT_BLOBS, AMBIENT_PAGE} from "@/app/_components/marketing/brand-styles";
import {MARKETING_IMAGES} from "@/app/_components/marketing/marketing-images";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({title, subtitle, children, footer}: Props) {
  const t = useTranslations();

  return (
    <div className={`relative flex min-h-screen flex-col overflow-hidden ${AMBIENT_PAGE} lg:flex-row`}>
      {AMBIENT_BLOBS}

      <div className="relative hidden min-h-screen w-[42%] flex-col justify-between border-r border-amber-200/40 p-10 xl:w-[44%] xl:p-12 dark:border-amber-900/30 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
          <Image src="/marketing/logo-mark.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0"/>
          <span>{t("common.appName")}</span>
        </Link>

        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-amber-300/70 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/50 dark:text-amber-200">
            {t("marketing.hero.badge")}
          </span>
          <p className="max-w-md text-2xl font-bold leading-snug text-foreground xl:text-3xl">
            {t("marketing.problem.title")}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-muted">{t("marketing.hero.subtitle")}</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-amber-900/30">
          <Image
            src={MARKETING_IMAGES.showcaseDining}
            alt={t("marketing.showcase.dining")}
            width={640}
            height={480}
            className="aspect-[4/3] w-full object-cover"
            sizes="44vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-blue-900/10"/>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/60 bg-white/90 p-8 shadow-xl backdrop-blur-sm dark:border-border dark:bg-surface/95">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Image src="/marketing/logo-mark.svg" alt="" width={32} height={32} className="h-8 w-8"/>
            <span className="font-bold text-foreground">{t("common.appName")}</span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>

          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({href, children}: {href: string; children: ReactNode}) {
  return (
    <p className="text-center text-sm text-muted">
      <Link href={href} className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
        {children}
      </Link>
    </p>
  );
}
