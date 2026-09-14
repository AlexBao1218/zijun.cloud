import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import TopBar from "@/app/components/TopBar";
import "../globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
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
  title: "Alex Bao",
  description:
    "Alex (Zijun) Bao — HKU engineering student who turns operational pain points into deployed systems. Portfolio: insurance, fleet and meeting-minutes tools, a 747-8F load planner, NeoChain WMS.",
  keywords: ["Alex Bao", "Zijun Bao", "HKU", "operations", "AI tooling", "portfolio"],
};

export const viewport: Viewport = {
  themeColor: "#fcfbf7",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "zh")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${instrument.variable} ${geistMono.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <NextIntlClientProvider messages={messages}>
          <TopBar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
