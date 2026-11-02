"use client"

import Image from "next/image";
import React, {ReactNode, useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {AMBIENT_APP} from "@/app/_components/marketing/brand-styles";
import {isMarketingShellPath} from "@/app/_lib/auth-routes";
import {getAuthToken, getSupportSession, subscribeSupportSession, SupportSessionState} from "@/app/_lib/auth-storage";
import {clearSupportSession} from "@/app/_lib/auth-storage";
import {leaveImpersonation} from "@/app/_services/impersonation.service";
import {SupportSessionBanner} from "@/app/_components/SupportSessionBanner";
import {setAuthenticatedUser} from "@/app/_store/features/auth/authSlice";
import {getVisibleNavGroups} from "@/app/_lib/nav-config";
import {useDocumentTitle} from "@/app/_hooks/useDocumentTitle";
import {usePageTitle, useTranslations} from "@/app/_hooks/useTranslations";
import {useClientReady} from "@/app/_hooks/useClientReady";
import {userInitials} from "@/app/_lib/user-display";
import {Buttons} from ".";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {signOut} from "@/app/_store/features/auth/authThunks";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {useInventoryAlerts} from "@/app/_hooks/useInventoryAlerts";

export default function SidebarLayout({children}: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [supportSession, setSupportSession] = useState<SupportSessionState | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {isSuperAdmin, user: capabilitiesUser} = useAuthCapabilities();
  const t = useTranslations();
  const pageTitle = usePageTitle();
  useDocumentTitle(pageTitle);
  const navGroups = getVisibleNavGroups(capabilitiesUser);
  const inventoryAlerts = useInventoryAlerts();
  const authStatus = useAppSelector((state) => state.auth.status);
  const ready = useClientReady();
  const isAuthenticated =
    ready && (Boolean(getAuthToken()) || authStatus === "authenticated");

  useEffect(() => subscribeSupportSession(() => setSupportSession(getSupportSession())), []);

  if (isMarketingShellPath(pathname, {ready, authenticated: isAuthenticated})) {
    return <>{children}</>;
  }

  const handleLeaveSupport = async () => {
    if (!supportSession) return;
    try {
      await leaveImpersonation(supportSession.id);
    } catch {
      // Still return the operator to their own session.
    }
    const actor = clearSupportSession();
    if (actor) dispatch(setAuthenticatedUser(actor));
    setSupportSession(null);
    router.push("/platform/organizations");
  };

  const handleLogout = async () => {
    await dispatch(signOut());
    router.replace("/login");
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800";

  return (
    <div className={`flex h-screen flex-col ${AMBIENT_APP}`}>
      {supportSession && <SupportSessionBanner session={supportSession} onLeave={handleLeaveSupport}/>}
      <div className="flex min-h-0 flex-1">
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={false}
            animate={{width: 260, opacity: 1}}
            exit={{width: 0, opacity: 0}}
            transition={{duration: 0.25}}
            className="flex h-full min-h-0 flex-col overflow-hidden border-r border-amber-200/40 bg-surface shadow-xl dark:border-amber-900/30"
          >
            <div className="shrink-0 border-b border-amber-200/40 bg-gradient-to-r from-amber-50/90 via-surface to-blue-50/70 p-4 dark:border-amber-900/30 dark:from-amber-950/40 dark:via-surface dark:to-blue-950/30">
              <div className="flex items-center gap-2.5">
                <Image src="/marketing/logo-mark.svg" alt="" width={32} height={32} className="h-8 w-8 shrink-0"/>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold tracking-tight text-foreground">{t("common.appName")}</h1>
                  <p className="truncate text-sm text-muted">
                    {user?.name ?? user?.email ?? t("common.adminPanel")}
                  </p>
                </div>
              </div>
              {isSuperAdmin && (
                <p className="mt-1 truncate text-xs font-medium text-amber-700 dark:text-amber-400">
                  {t("nav.platformReadOnly")}
                </p>
              )}
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto p-3">
              <div className="space-y-4">
                {navGroups.map((group) => (
                  <div key={group.labelKey}>
                    {navGroups.length > 1 && (
                      <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {t(group.labelKey)}
                      </p>
                    )}
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          href={item.link}
                          key={item.link}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${linkClass(item.link)}`}
                        >
                          <FontAwesomeIcon icon={item.icon} className="w-4 shrink-0 text-[15px]"/>
                          <span className="truncate">{t(item.labelKey)}</span>
                          {item.link === "/inventory" && inventoryAlerts.total > 0 && (
                            <span
                              className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-amber-950"
                              aria-label={t("inventory.alertsBadge", {count: inventoryAlerts.total})}
                            >
                              {inventoryAlerts.total}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>

            <div className="shrink-0 border-t border-border p-3">
              <Buttons
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg"
              >
                <FontAwesomeIcon icon={faRightFromBracket}/> {t("common.signOut")}
              </Buttons>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-amber-200/40 bg-surface/90 p-4 backdrop-blur-sm dark:border-amber-900/30">
          <div className="flex items-center gap-3">
            <Buttons
              variant="outline"
              size="icon"
              className="rounded-lg"
              onClick={() => setIsOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faBars}/>
            </Buttons>
            <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
          </div>

          <Link
            href="/settings"
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition hover:bg-surface-muted ${
              pathname === "/settings"
                ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40"
                : "border-border"
            }`}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
              aria-hidden
            >
              {user ? userInitials(user) : <FontAwesomeIcon icon={faUser}/>}
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-foreground sm:inline">
              {user?.name ?? user?.email ?? t("common.myAccount")}
            </span>
          </Link>
        </header>

        <main className="relative min-h-0 flex-1 overflow-auto p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-600/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/5"
          />
          <div className="relative">{children}</div>
        </main>
      </div>
      </div>
    </div>
  );
}
