"use client"

import type {Metadata} from "next";
import {Roboto, Roboto_Mono} from "next/font/google";
import "./globals.css";

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import SidebarLayout from "@/app/components/SidebarLayout";
import {Provider} from "react-redux";
import {store} from "./store"

config.autoAddCss = false

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Ubuteco React App",
//   description: "Ubuteco React App",
// };

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
      className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
    >
    <Provider store={store}>
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </Provider>
    </body>
    </html>
  );
}
