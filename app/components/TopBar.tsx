"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function TopBar() {
  const t = useTranslations("nav");
  const anchors = [
    { hash: "work", label: t("work") },
    { hash: "skills", label: t("skills") },
    { hash: "about", label: t("about") },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper border-b border-ink">
      <div className="flex items-center justify-between gap-4 px-6 md:px-12 xl:px-16 h-16 md:h-20 xl:h-24">
        <Link href="/" className="font-serif text-[28px] md:text-[36px] xl:text-[42px] leading-none whitespace-nowrap">
          alex bao
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 md:gap-10">
          {anchors.map((a) => (
            <Link
              key={a.hash}
              href={{ pathname: "/", hash: a.hash }}
              className="font-serif text-xl md:text-[26px] xl:text-[30px] leading-none hover:underline decoration-1 underline-offset-[6px]"
            >
              {a.label}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline font-serif text-xl md:text-[26px] xl:text-[30px] leading-none hover:underline decoration-1 underline-offset-[6px]"
          >
            {t("resume")}
          </a>
        </nav>
      </div>
    </header>
  );
}
