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
  faHouse,
  faIndustry,
  faRightFromBracket,
  faUsers,
  faWineBottle
} from "@fortawesome/free-solid-svg-icons";
import {Button} from ".";
import Link from "next/link";

export default function SidebarLayout({children}: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {label: "Dashboard", icon: faHouse, link: "/"},
    {label: "Beers", icon: faBeer, link: "/beers"},
    {label: "Dishes", icon: faUsers, link: "/dishes"},
    {label: "Drinks", icon: faGlassMartini, link: "/drinks"},
    {label: "Makers", icon: faIndustry, link: "/makers"},
    {label: "Orders", icon: faCartShopping, link: "/orders"},
    {label: "Organizations", icon: faBuilding, link: "/organizations"},
    {label: "Tables", icon: faChair, link: "/tables"},
    {label: "Wines", icon: faWineBottle, link: "/wines"},
    {label: "Users", icon: faUsers, link: "/users"},
    {label: "Settings", icon: faGear, link: "/"},
  ];

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
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-gray-100 transition text-left"
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-base"/>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t">
              <Button className="w-full rounded-2xl flex items-center gap-2">
                <FontAwesomeIcon icon={faRightFromBracket}/> Logout
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl"
              onClick={() => setIsOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faBars}/>
            </Button>
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

