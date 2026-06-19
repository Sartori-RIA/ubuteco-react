"use client";

import {useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBellConcierge,
  faBookOpen,
  faFireBurner,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {Buttons} from "@/app/_components";
import {KitchenQueueMock} from "@/app/_components/marketing/KitchenQueueMock";
import {MARKETING_IMAGES} from "@/app/_components/marketing/marketing-images";
import {MarketingFooter} from "@/app/_components/marketing/MarketingFooter";
import {MarketingHeader} from "@/app/_components/marketing/MarketingHeader";
import {useTranslations} from "@/app/_hooks/useTranslations";
import type {TranslationKey} from "@/app/_lib/i18n";

import {BRAND_CTA} from "@/app/_components/marketing/brand-styles";

const FEATURES: Array<{
  id: string;
  icon: typeof faBellConcierge;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  accent: string;
  cardTint: string;
}> = [
  {
    id: "operations",
    icon: faBellConcierge,
    titleKey: "marketing.features.operations.title",
    bodyKey: "marketing.features.operations.body",
    accent: "from-blue-600 to-blue-700 shadow-blue-600/30",
    cardTint: "from-blue-50/80 to-surface dark:from-blue-950/30 dark:to-surface",
  },
  {
    id: "catalog",
    icon: faBookOpen,
    titleKey: "marketing.features.catalog.title",
    bodyKey: "marketing.features.catalog.body",
    accent: "from-amber-500 to-orange-600 shadow-amber-500/30",
    cardTint: "from-amber-50/80 to-surface dark:from-amber-950/25 dark:to-surface",
  },
  {
    id: "kitchen",
    icon: faFireBurner,
    titleKey: "marketing.features.kitchen.title",
    bodyKey: "marketing.features.kitchen.body",
    accent: "from-orange-500 to-red-600 shadow-orange-500/30",
    cardTint: "from-orange-50/80 to-surface dark:from-orange-950/25 dark:to-surface",
  },
  {
    id: "settings",
    icon: faGlobe,
    titleKey: "marketing.features.settings.title",
    bodyKey: "marketing.features.settings.body",
    accent: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
    cardTint: "from-emerald-50/80 to-surface dark:from-emerald-950/25 dark:to-surface",
  },
];

const SHOWCASE = [
  {src: MARKETING_IMAGES.showcaseDining, altKey: "marketing.showcase.dining" as TranslationKey},
  {src: MARKETING_IMAGES.showcaseKitchen, altKey: "marketing.showcase.kitchen" as TranslationKey},
  {src: MARKETING_IMAGES.showcaseBar, altKey: "marketing.showcase.bar" as TranslationKey},
];

const PROOF_STATS = [
  {valueKey: "marketing.proof.stats.realtime.value" as TranslationKey, labelKey: "marketing.proof.stats.realtime.label" as TranslationKey, color: "text-blue-600 dark:text-blue-400"},
  {valueKey: "marketing.proof.stats.multitenant.value" as TranslationKey, labelKey: "marketing.proof.stats.multitenant.label" as TranslationKey, color: "text-amber-600 dark:text-amber-400"},
  {valueKey: "marketing.proof.stats.opensource.value" as TranslationKey, labelKey: "marketing.proof.stats.opensource.label" as TranslationKey, color: "text-emerald-600 dark:text-emerald-400"},
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
        <section className="relative overflow-hidden border-b border-amber-200/50 bg-gradient-to-br from-amber-100 via-orange-50 to-blue-100 dark:border-amber-900/40 dark:from-amber-950/40 dark:via-background dark:to-blue-950/50">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-600/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-600/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-orange-400/15 blur-2xl"
          />

          <div className="relative mx-auto max-w-6xl px-4 py-16 pb-28 sm:px-6 sm:py-24 sm:pb-32 lg:py-28 lg:pb-36">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <span className="inline-flex items-center rounded-full border border-amber-300/70 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/50 dark:text-amber-200">
                  {t("marketing.hero.badge")}
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[2.75rem] lg:leading-tight">
                  {t("marketing.hero.title")}
                </h1>
                <p className="max-w-xl text-lg text-muted">{t("marketing.hero.subtitle")}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/signup">
                    <Buttons size="lg" className={`w-full rounded-xl sm:w-auto ${BRAND_CTA}`}>
                      {t("marketing.hero.ctaPrimary")}
                    </Buttons>
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-300/60 bg-white/70 px-6 text-sm font-medium text-foreground shadow-sm backdrop-blur hover:bg-white dark:border-amber-800/50 dark:bg-surface/70 dark:hover:bg-surface"
                  >
                    {t("marketing.hero.ctaSecondary")}
                  </a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/60 dark:ring-amber-900/30">
                  <Image
                    src={MARKETING_IMAGES.heroRestaurant}
                    alt={t("marketing.hero.imageAlt")}
                    width={900}
                    height={675}
                    priority
                    className="aspect-[4/3] w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/50 via-transparent to-blue-900/10 dark:from-black/60"/>
                </div>
                <div className="absolute -bottom-6 -left-4 right-4 sm:-left-8 sm:right-8 lg:-bottom-8">
                  <KitchenQueueMock/>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-gradient-to-b from-amber-50/60 to-surface-muted dark:from-amber-950/20 dark:to-surface-muted">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">{t("marketing.problem.title")}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{t("marketing.problem.body")}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {SHOWCASE.map(({src, altKey}) => (
                <div
                  key={altKey}
                  className="group relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-amber-200/50 transition hover:-translate-y-1 hover:shadow-xl dark:ring-amber-900/40"
                >
                  <Image
                    src={src}
                    alt={t(altKey)}
                    width={640}
                    height={480}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-amber-950/10 to-transparent"/>
                  <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white">{t(altKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="bg-gradient-to-b from-background via-blue-50/30 to-background dark:via-blue-950/15"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("marketing.features.title")}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
              {FEATURES.map(({id, icon, titleKey, bodyKey, accent, cardTint}) => (
                <article
                  key={id}
                  className={`rounded-2xl border border-border/80 bg-gradient-to-br ${cardTint} p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-lg`}
                  >
                    <FontAwesomeIcon icon={icon} className="h-5 w-5"/>
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t(bodyKey)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-gradient-to-r from-amber-100/70 via-orange-50 to-blue-100/70 dark:from-amber-950/30 dark:via-surface-muted dark:to-blue-950/30">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl font-semibold sm:text-2xl">{t("marketing.proof.title")}</h2>
              <p className="mt-3 text-muted">{t("marketing.proof.body")}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {PROOF_STATS.map(({valueKey, labelKey, color}) => (
                <div
                  key={valueKey}
                  className="rounded-2xl border border-white/60 bg-white/80 px-5 py-6 text-center shadow-sm backdrop-blur dark:border-border dark:bg-surface/80"
                >
                  <p className={`text-2xl font-bold ${color}`}>{t(valueKey)}</p>
                  <p className="mt-2 text-sm text-muted">{t(labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-amber-600 px-6 py-12 text-center text-white shadow-xl shadow-blue-900/20 sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl"
            />
            <h2 className="relative text-2xl font-bold sm:text-3xl">{t("marketing.cta.title")}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-blue-100">{t("marketing.cta.subtitle")}</p>
            <Link
              href="/signup"
              className="relative mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-amber-50 hover:text-blue-800"
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
