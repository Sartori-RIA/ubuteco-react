"use client";

import {useEffect} from "react";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBellConcierge,
  faBookOpen,
  faFireBurner,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {Buttons} from "@/app/_components";
import {MarketingFooter} from "@/app/_components/marketing/MarketingFooter";
import {MarketingHeader} from "@/app/_components/marketing/MarketingHeader";
import {useTranslations} from "@/app/_hooks/useTranslations";
import type {TranslationKey} from "@/app/_lib/i18n";

const FEATURES: Array<{id: string; icon: typeof faBellConcierge; titleKey: TranslationKey; bodyKey: TranslationKey}> =
  [
    {
      id: "operations",
      icon: faBellConcierge,
      titleKey: "marketing.features.operations.title",
      bodyKey: "marketing.features.operations.body",
    },
    {
      id: "catalog",
      icon: faBookOpen,
      titleKey: "marketing.features.catalog.title",
      bodyKey: "marketing.features.catalog.body",
    },
    {
      id: "kitchen",
      icon: faFireBurner,
      titleKey: "marketing.features.kitchen.title",
      bodyKey: "marketing.features.kitchen.body",
    },
    {
      id: "settings",
      icon: faGlobe,
      titleKey: "marketing.features.settings.title",
      bodyKey: "marketing.features.settings.body",
    },
  ];

export function LandingPage() {
  const t = useTranslations();

  useEffect(() => {
    document.title = t("marketing.meta.title");
  }, [t]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingHeader/>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[2.75rem] lg:leading-tight">
                {t("marketing.hero.title")}
              </h1>
              <p className="max-w-xl text-lg text-muted">{t("marketing.hero.subtitle")}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup">
                  <Buttons size="lg" className="w-full rounded-xl sm:w-auto">
                    {t("marketing.hero.ctaPrimary")}
                  </Buttons>
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-medium hover:bg-surface-muted"
                >
                  {t("marketing.hero.ctaSecondary")}
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted">
                  <span>{t("nav.kitchen")}</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"/>
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["Awaiting", "Cooking", "Ready", "Done"].map((col, index) => (
                    <div key={col} className="rounded-xl border border-border bg-surface-muted p-3">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{col}</p>
                      {index === 0 ? (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs dark:border-blue-800 dark:bg-blue-950/40">
                          <p className="font-semibold">House Burger</p>
                          <p className="text-muted">Table 4 · ×2</p>
                        </div>
                      ) : (
                        <p className="py-4 text-center text-[10px] text-muted">—</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface-muted">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("marketing.problem.title")}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t("marketing.problem.body")}</p>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("marketing.features.title")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {FEATURES.map(({id, icon, titleKey, bodyKey}) => (
              <article
                key={id}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-blue-300 dark:hover:border-blue-700"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <FontAwesomeIcon icon={icon} className="h-5 w-5"/>
                </span>
                <h3 className="mt-4 text-lg font-semibold">{t(titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(bodyKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface-muted">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
            <h2 className="text-xl font-semibold sm:text-2xl">{t("marketing.proof.title")}</h2>
            <p className="mt-3 text-muted">{t("marketing.proof.body")}</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="rounded-2xl bg-blue-600 px-6 py-12 text-center text-white sm:px-10 sm:py-14">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("marketing.cta.title")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-blue-100">{t("marketing.cta.subtitle")}</p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              {t("marketing.cta.button")}
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter/>
    </div>
  );
}
