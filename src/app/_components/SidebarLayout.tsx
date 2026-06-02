"use client"

import React, {ReactNode, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBeer,
  faBuilding,
  faCartShopping,
  faChair,
  faGear,
  faGlassMartini,
  faHamburger,
  faUtensils,
  faHouse,
  faIndustry,
  faRightFromBracket,
  faUser,
  faUsers,
  faWineBottle
} from "@fortawesome/free-solid-svg-icons";
import {isAuthPublicPath} from "@/app/_lib/auth-routes";
import {usePageTitle, useTranslations} from "@/app/_hooks/useTranslations";
import type {TranslationKey} from "@/app/_lib/i18n";
import {userInitials} from "@/app/_lib/user-display";
import {Buttons} from ".";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/app/_store/hooks";
import {signOut} from "@/app/_store/features/auth/authThunks";
import {useAuthCapabilities} from "@/app/_hooks/useAuthCapabilities";
import {canAccessKitchen, isKitchenStaff} from "@/app/_lib/auth-roles";

export default function SidebarLayout({children}: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {isSuperAdmin, user: capabilitiesUser} = useAuthCapabilities();
  const kitchenOnly = isKitchenStaff(capabilitiesUser);
  const t = useTranslations();
  const pageTitle = usePageTitle();

  if (isAuthPublicPath(pathname)) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await dispatch(signOut());
    router.replace("/login");
  };

  const allMenuItems: {labelKey: TranslationKey; icon: typeof faHouse; link: string; kitchen?: boolean}[] = [
    {labelKey: "nav.dashboard", icon: faHouse, link: "/"},
    {labelKey: "nav.kitchen", icon: faUtensils, link: "/kitchen", kitchen: true},
    {labelKey: "nav.beers", icon: faBeer, link: "/beers"},
    {labelKey: "nav.beerStyles", icon: faBeer, link: "/beer-styles"},
    {labelKey: "nav.drinks", icon: faGlassMartini, link: "/drinks"},
    {labelKey: "nav.wines", icon: faWineBottle, link: "/wines"},
    {labelKey: "nav.wineStyles", icon: faWineBottle, link: "/wine-styles"},
    {labelKey: "nav.dishes", icon: faHamburger, link: "/dishes"},
    {labelKey: "nav.foods", icon: faHamburger, link: "/foods"},
    {labelKey: "nav.makers", icon: faIndustry, link: "/makers"},
    {labelKey: "nav.orders", icon: faCartShopping, link: "/orders"},
    {labelKey: "nav.organizations", icon: faBuilding, link: "/organizations"},
    {labelKey: "nav.tables", icon: faChair, link: "/tables"},
    {labelKey: "nav.users", icon: faUsers, link: "/users"},
    {labelKey: "nav.settings", icon: faGear, link: "/settings"},
  ];

  const menuItems = kitchenOnly
    ? allMenuItems.filter((item) => item.link === "/kitchen" || item.link === "/settings")
    : allMenuItems.filter(
        (item) => !("kitchen" in item && item.kitchen) || canAccessKitchen(capabilitiesUser)
      );

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={false}
            animate={{width: 260, opacity: 1}}
            exit={{width: 0, opacity: 0}}
            transition={{duration: 0.25}}
            className="flex flex-col justify-between overflow-hidden border-r border-border bg-surface shadow-xl"
          >
            <div>
              <div className="border-b border-border p-6">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{t("common.appName")}</h1>
                <p className="text-sm text-muted">
                  {user?.name ?? user?.email ?? t("common.adminPanel")}
                </p>
                {isSuperAdmin && (
                  <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    {t("nav.platformReadOnly")}
                  </p>
                )}
              </div>

              <nav className="space-y-2 p-4">
                {menuItems.map((item) => (
                  <Link
                    href={item.link}
                    key={item.link}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-surface-muted ${linkClass(item.link)}`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-base"/>
                    <span className="text-sm font-medium">{t(item.labelKey)}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-border p-4">
              <Buttons onClick={handleLogout} className="flex w-full items-center gap-2 rounded-2xl">
                <FontAwesomeIcon icon={faRightFromBracket}/> {t("common.signOut")}
              </Buttons>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <Buttons
              variant="outline"
              size="icon"
              className="rounded-2xl"
              onClick={() => setIsOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faBars}/>
            </Buttons>
            <h2 className="text-lg font-semibold text-foreground">{pageTitle}</h2>
          </div>

          <Link
            href="/settings"
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition hover:bg-surface-muted ${
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

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
