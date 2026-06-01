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
import {getPageTitle} from "@/app/_lib/page-titles";
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

  if (isAuthPublicPath(pathname)) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await dispatch(signOut());
    router.replace("/login");
  };

  const allMenuItems = [
    {label: "Dashboard", icon: faHouse, link: "/"},
    {label: "Kitchen", icon: faUtensils, link: "/kitchen", kitchen: true},
    {label: "Beers", icon: faBeer, link: "/beers"},
    {label: "Beer Styles", icon: faBeer, link: "/beer-styles"},
    {label: "Drinks", icon: faGlassMartini, link: "/drinks"},
    {label: "Wines", icon: faWineBottle, link: "/wines"},
    {label: "Wine Styles", icon: faWineBottle, link: "/wine-styles"},
    {label: "Dishes", icon: faHamburger, link: "/dishes"},
    {label: "Food", icon: faHamburger, link: "/foods"},
    {label: "Makers", icon: faIndustry, link: "/makers"},
    {label: "Orders", icon: faCartShopping, link: "/orders"},
    {label: "Organizations", icon: faBuilding, link: "/organizations"},
    {label: "Tables", icon: faChair, link: "/tables"},
    {label: "Users", icon: faUsers, link: "/users"},
    {label: "Settings", icon: faGear, link: "/settings"},
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
                <h1 className="text-xl font-bold tracking-tight text-foreground">Ubuteco</h1>
                <p className="text-sm text-muted">
                  {user?.name ?? user?.email ?? "Admin Panel"}
                </p>
                {isSuperAdmin && (
                  <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                    Platform — catalog read-only
                  </p>
                )}
              </div>

              <nav className="space-y-2 p-4">
                {menuItems.map((item) => (
                  <Link
                    href={item.link}
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-surface-muted ${linkClass(item.link)}`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-base"/>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-border p-4">
              <Buttons onClick={handleLogout} className="flex w-full items-center gap-2 rounded-2xl">
                <FontAwesomeIcon icon={faRightFromBracket}/> Sign out
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
            <h2 className="text-lg font-semibold text-foreground">{getPageTitle(pathname)}</h2>
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
              {user?.name ?? user?.email ?? "My account"}
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
