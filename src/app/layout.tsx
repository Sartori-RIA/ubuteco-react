import type {Metadata} from "next";
import {Roboto, Roboto_Mono} from "next/font/google";
import "./globals.css";

import {AppearanceScript} from "@/app/_components/AppearanceScript";
import {Providers} from "@/app/providers";

export const metadata: Metadata = {
  title: {
    default: "uButeco",
    template: "uButeco | %s",
  },
};

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        <AppearanceScript/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
