import {Roboto, Roboto_Mono} from "next/font/google";
import "./globals.css";

import {AppearanceScript} from "@/app/_components/AppearanceScript";
import {Providers} from "@/app/providers";

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
      <head>
        <AppearanceScript/>
      </head>
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
