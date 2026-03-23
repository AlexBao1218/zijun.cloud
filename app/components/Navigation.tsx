"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#faf9f7]/80 backdrop-blur-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-24 h-16 md:h-20">
          <div className="relative h-full flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-sm font-medium text-[#3d2b1f]/35 hover:text-[#3d2b1f]/55 transition-colors"
            >
              Alex Bao
            </Link>

            {/* Desktop nav items */}
            <ul className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-sm transition-colors ${
                      pathname === item.href
                        ? "text-[#3d2b1f]/70"
                        : "text-[#3d2b1f]/35 hover:text-[#3d2b1f]/55"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right: locale + hamburger */}
            <div className="flex items-center gap-4 md:gap-0">
              <button
                onClick={toggleLocale}
                className="text-sm text-[#3d2b1f]/30 hover:text-[#3d2b1f]/55 transition-colors"
              >
                {locale === "en" ? "中文" : "EN"}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                aria-label="Open menu"
              >
                <span className="block w-5 h-px bg-[#3d2b1f]/40" />
                <span className="block w-5 h-px bg-[#3d2b1f]/40" />
                <span className="block w-3 h-px bg-[#3d2b1f]/40" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#faf9f7] flex flex-col items-center justify-center gap-10 animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#3d2b1f]/40"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Nav items */}
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-light text-[#3d2b1f]/50 hover:text-[#3d2b1f]/80 transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {item.label}
            </Link>
          ))}

          {/* Locale toggle at bottom */}
          <button
            onClick={toggleLocale}
            className="mt-6 text-base text-[#3d2b1f]/30 hover:text-[#3d2b1f]/55 transition-colors"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </div>
      )}
    </>
  );
}
