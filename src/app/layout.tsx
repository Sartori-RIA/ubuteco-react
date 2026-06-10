import type {Metadata} from "next";
import {Roboto, Roboto_Mono} from "next/font/google";
import "./globals.css";

import {AppearanceScript} from "@/app/_components/AppearanceScript";
import {Providers} from "@/app/providers";

export const metadata: Metadata = {
  title: {
    default: "uButeco — Gestão para bares e restaurantes",
    template: "uButeco | %s",
  },
  description:
    "SaaS multi-tenant para bares e restaurantes: pedidos, fila da cozinha em tempo real, cardápio e configurações regionais.",
  openGraph: {
    title: "uButeco — Gestão para bares e restaurantes",
    description:
      "Pedidos, cozinha ao vivo, cardápio e equipe — uma plataforma feita para hospitality.",
    locale: "pt_BR",
    type: "website",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        <AppearanceScript/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
