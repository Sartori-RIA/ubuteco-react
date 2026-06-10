"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {formatDocumentTitle, getPageTitle} from "@/app/_lib/page-titles";
import {useTranslations} from "@/app/_hooks/useTranslations";

/** Sets `document.title` to `uButeco | {label}` while the component is mounted. */
export function useDocumentTitle(label: string | undefined) {
  useEffect(() => {
    if (!label) return;
    document.title = formatDocumentTitle(label);
  }, [label]);
}

/** Prefer `label` when loaded; otherwise keep the static route title from the pathname. */
export function useEntityDocumentTitle(label: string | undefined) {
  const pathname = usePathname();
  const t = useTranslations();
  const resolved = label ?? getPageTitle(pathname, t);
  useDocumentTitle(resolved);
}
