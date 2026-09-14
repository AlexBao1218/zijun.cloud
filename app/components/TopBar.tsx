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
    // useRouter().replace only accepts { pathname, query } as an object, so keep the hash via the string form.
    router.replace(pathname + window.location.hash, { locale: locale === "en" ? "zh" : "en" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper border-b border-ink">
      <div className="flex items-center justify-between gap-4 px-6 md:px-12 h-16 md:h-20">
        <Link href="/" className="font-serif text-[28px] md:text-[36px] leading-none whitespace-nowrap">
          alex bao
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 md:gap-10">
          {anchors.map((a) => (
            <Link
              key={a.hash}
              href={{ pathname: "/", hash: a.hash }}
              className="font-serif text-xl md:text-[26px] leading-none hover:underline decoration-1 underline-offset-[6px]"
            >
              {a.label}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline font-serif text-xl md:text-[26px] leading-none hover:underline decoration-1 underline-offset-[6px]"
          >
            {t("resume")}
          </a>
          <button
            type="button"
            onClick={toggleLocale}
            className="border border-ink px-2.5 py-1.5 text-[12px] hover:bg-fill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
