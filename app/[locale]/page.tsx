import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import { Link } from "@/i18n/routing";

type HomeContent = {
  eyebrow: string;
  tagline: string;
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home.hero");
  const content = await loadContent<HomeContent>("home", locale);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center pt-16 md:pt-20">
        <div className="w-full max-w-3xl mx-auto text-center px-8">
          {/* Label */}
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-10 animate-fade-in">
            {content.eyebrow}
          </p>

          {/* Name */}
          <h1 className="font-serif text-6xl md:text-8xl font-medium text-[#3d2b1f] mb-6 tracking-tight animate-fade-in-delay-1">
            {t("name")}
          </h1>

          {/* Role */}
          <p className="text-base md:text-lg text-[#b85c38]/70 tracking-wide mb-10 animate-fade-in-delay-2">
            {t("role")}
          </p>

          {/* Tagline */}
          <p className="text-base md:text-xl text-[#3d2b1f]/50 leading-relaxed max-w-4xl mx-auto mb-10 md:mb-14 animate-fade-in-delay-3">
            {content.tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-4">
            <Link
              href="/projects"
              className="px-9 py-3.5 bg-[#b85c38] text-[#faf9f7] text-sm font-medium rounded-full hover:bg-[#a04e2e] transition-colors"
            >
              {t("cta")}
            </Link>
            <Link
              href="/contact"
              className="px-9 py-3.5 border border-[#3d2b1f]/10 text-[#3d2b1f]/50 text-sm font-medium rounded-full hover:border-[#3d2b1f]/25 hover:text-[#3d2b1f]/75 transition-colors"
            >
              {t("secondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center pb-10 md:pb-14 animate-fade-in-delay-5">
        <div className="w-px h-10 md:h-14 bg-gradient-to-b from-transparent via-[#b85c38]/20 to-transparent" />
      </div>

      {/* Corner decorations */}
      <div className="fixed top-16 md:top-24 left-6 md:left-20 w-8 md:w-10 h-8 md:h-10 border-t border-l border-[#b85c38]/20 pointer-events-none" />
      <div className="fixed bottom-10 md:bottom-14 right-6 md:right-20 w-8 md:w-10 h-8 md:h-10 border-b border-r border-[#b85c38]/20 pointer-events-none" />
    </main>
  );
}
