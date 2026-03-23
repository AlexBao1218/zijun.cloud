import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_SC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navigation from "@/app/components/Navigation";
import "../globals.css";
import { notFound } from "next/navigation";
import localFont from "next/font/local";

const geist = localFont({
  src: [
    { path: "../fonts/Geist-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Geist-Light.woff2", weight: "300", style: "normal" },
  ],
  variable: "--font-geist",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Alex Bao — AI & Full-Stack Developer",
  description:
    "Personal website of Alex Bao (Zijun). HKU student, AI & Full-Stack Developer, building systems that learn and warehouses that think.",
  keywords: ["Alex Bao", "Zijun Bao", "HKU", "AI Developer", "Full-Stack", "WMS", "NeoChain"],
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${cormorant.variable} ${notoSerif.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col bg-[#faf9f7]">
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
