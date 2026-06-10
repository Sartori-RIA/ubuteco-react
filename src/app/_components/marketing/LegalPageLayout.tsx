"use client";

import Link from "next/link";
import {MarketingFooter} from "@/app/_components/marketing/MarketingFooter";
import {MarketingHeader} from "@/app/_components/marketing/MarketingHeader";
import {useDocumentTitle} from "@/app/_hooks/useDocumentTitle";
import type {LegalDocument} from "@/app/_lib/legal/types";
import {useTranslations} from "@/app/_hooks/useTranslations";

type Props = {
  content: LegalDocument;
};

export function LegalPageLayout({content}: Props) {
  const t = useTranslations();
  useDocumentTitle(content.title);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingHeader/>

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← {t("legal.backToHome")}
          </Link>

          <header className="mt-6 border-b border-border pb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{content.title}</h1>
            <p className="mt-3 text-sm text-muted">
              {t("legal.lastUpdated")}: {content.lastUpdated}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">{content.intro}</p>
          </header>

          <div className="mt-10 space-y-10">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <MarketingFooter/>
    </div>
  );
}
