import { getTranslations, setRequestLocale } from "next-intl/server";
import CopyEmailButton from "./CopyEmailButton";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <main className="pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-4">
          {locale === "en" ? "Contact" : "联系"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-3">
          {t("title")}
        </h1>
        <p className="text-sm md:text-base text-[#3d2b1f]/40 mb-10 md:mb-12">{t("subtitle")}</p>

        {/* Interactive contact section */}
        <div className="grid gap-0">
          {/* Email - with copy button */}
          <CopyEmailButton locale={locale} />

          {/* GitHub */}
          <a
            href="https://github.com/AlexBao1218"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="flex items-center justify-between py-5 border-b border-[#3d2b1f]/5 group-hover:border-[#b85c38]/20 transition-colors">
              <div>
                <p className="text-xs text-[#3d2b1f]/30 mb-1 tracking-wide">GitHub</p>
                <p className="text-lg text-[#3d2b1f]/70 group-hover:text-[#b85c38]/80 transition-colors font-light">
                  @AlexBao1218
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#3d2b1f]/5 flex items-center justify-center text-[#3d2b1f]/20 group-hover:border-[#b85c38]/30 group-hover:text-[#b85c38]/50 transition-all group-hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </a>

          {/* CV Download */}
          <a
            href="/cv.pdf"
            download
            className="group"
          >
            <div className="flex items-center justify-between py-5 border-b border-[#3d2b1f]/5 group-hover:border-[#b85c38]/20 transition-colors">
              <div>
                <p className="text-xs text-[#3d2b1f]/30 mb-1 tracking-wide">
                  {locale === "en" ? "Resume / CV" : "简历下载"}
                </p>
                <p className="text-lg text-[#3d2b1f]/70 group-hover:text-[#b85c38]/80 transition-colors font-light">
                  PDF · Bao Zijun · HKU
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#3d2b1f]/5 flex items-center justify-center text-[#3d2b1f]/20 group-hover:border-[#b85c38]/30 group-hover:text-[#b85c38]/50 transition-all group-hover:scale-110">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Fun interactive element - floating shapes */}
        <div className="mt-6 flex justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-[#b85c38]/10 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-[#b85c38]/5" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#b85c38]/5" />
            </div>
          </div>
        </div>

        <p className="text-center text-base text-[#3d2b1f]/25 mt-3">
          {locale === "en" ? "Let's build something together" : "一起创造点什么吧"}
        </p>
      </div>
    </main>
  );
}
