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
        : "text-gray-700 hover:bg-gray-200"
    }`

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={false}
            animate={{width: 260, opacity: 1}}
            exit={{width: 0, opacity: 0}}
            transition={{duration: 0.25}}
            className="bg-white shadow-xl flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="p-6 border-b">
                <h1 className="text-xl font-bold tracking-tight">Ubuteco</h1>
                <p className="text-sm text-gray-500">
                  {user?.name ?? user?.email ?? "Admin Panel"}
                </p>
                {isSuperAdmin && (
                  <p className="mt-1 text-xs font-medium text-amber-700">
                    Platform — catalog read-only
                  </p>
                )}
              </div>

              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  return (
                    <Link
                      href={item.link}
                      key={item.label}
                      className={
                        `flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-gray-100 transition text-left ${linkClass(item.link)}`
                      }
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-base"/>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t">
              <Buttons onClick={handleLogout} className="w-full rounded-2xl flex items-center gap-2">
                <FontAwesomeIcon icon={faRightFromBracket}/> Sign out
              </Buttons>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Buttons
              variant="outline"
              size="icon"
              className="rounded-2xl"
              onClick={() => setIsOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faBars}/>
            </Buttons>
            <h2 className="text-lg font-semibold">{getPageTitle(pathname)}</h2>
          </div>

          <Link
            href="/settings"
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition hover:bg-gray-50 ${
              pathname === "/settings" ? "border-blue-200 bg-blue-50" : "border-gray-200"
            }`}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
              aria-hidden
            >
              {user ? userInitials(user) : <FontAwesomeIcon icon={faUser}/>}
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-gray-800 sm:inline">
              {user?.name ?? user?.email ?? "My account"}
            </span>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

