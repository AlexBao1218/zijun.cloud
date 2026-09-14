"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function TopBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const anchors = [
    { hash: "work", label: t("work") },
    { hash: "skills", label: t("skills") },
    { hash: "about", label: t("about") },
  ];

  const toggleLocale = () => {
    // next-intl's router href is `string | { pathname, query }` — no `hash` field —
    // so the hash is kept by appending it to the pathname string.
    router.replace(pathname + window.location.hash, {
      locale: locale === "en" ? "zh" : "en",
    });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper border-b border-ink">
      <div className="flex items-center justify-between gap-3 px-5 md:px-10 h-14 md:h-16">
        <Link href="/" className="font-serif text-xl md:text-[28px] leading-none whitespace-nowrap">
          alex bao
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3 md:gap-7 text-[13px]">
          {anchors.map((a) => (
            <Link
              key={a.hash}
              href={{ pathname: "/", hash: a.hash }}
              className="underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              {a.label}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {t("resume")}
          </a>
          <button
            type="button"
            onClick={toggleLocale}
            className="border border-ink px-2 py-1.5 text-[12px] hover:bg-fill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
