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
  faHouse,
  faIndustry,
  faRightFromBracket,
  faUsers,
  faWineBottle
} from "@fortawesome/free-solid-svg-icons";
import {Buttons} from ".";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function SidebarLayout({children}: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname()

  const menuItems = [
    {label: "Dashboard", icon: faHouse, link: "/"},

    {label: "Beers", icon: faBeer, link: "/beers"},
    {label: "Beer Styles", icon: faBeer, link: "/beer-styles"},
    {label: "Drinks", icon: faGlassMartini, link: "/drinks"},
    {label: "Wines", icon: faWineBottle, link: "/wines"},

    {label: "Dishes", icon: faHamburger, link: "/dishes"},
    {label: "Food", icon: faHamburger, link: "/foods"},

    {label: "Makers", icon: faIndustry, link: "/makers"},

    {label: "Orders", icon: faCartShopping, link: "/orders"},
    {label: "Organizations", icon: faBuilding, link: "/organizations"},
    {label: "Tables", icon: faChair, link: "/tables"},

    {label: "Users", icon: faUsers, link: "/users"},
    {label: "Settings", icon: faGear, link: "/"},
  ];

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
            initial={{width: 0, opacity: 0}}
            animate={{width: 260, opacity: 1}}
            exit={{width: 0, opacity: 0}}
            transition={{duration: 0.25}}
            className="bg-white shadow-xl flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="p-6 border-b">
                <h1 className="text-xl font-bold tracking-tight">My App</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
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
              <Buttons onClick={() => alert("logout")} className="w-full rounded-2xl flex items-center gap-2">
                <FontAwesomeIcon icon={faRightFromBracket}/> Logout
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
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

