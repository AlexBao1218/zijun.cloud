import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import SectionContainer from "@/app/components/SectionContainer";
import PageHeader from "@/app/components/PageHeader";
import CopyEmailButton from "./CopyEmailButton";

type ContactLink = {
  type: "email" | "external" | "download";
  label: string;
  value: string;
  url?: string;
};

type ContactContent = {
  eyebrow: string;
  links: ContactLink[];
  tagline: string;
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const content = await loadContent<ContactContent>("contact", locale);

  return (
    <SectionContainer className="pb-16 md:pb-20">
      <PageHeader
        eyebrow={content.eyebrow}
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleClassName="text-sm md:text-base text-[#3d2b1f]/40 mb-10 md:mb-12"
      />

      {/* Interactive contact section */}
      <div className="grid gap-0">
        {content.links.map((link) => {
          if (link.type === "email") {
            return <CopyEmailButton key={link.label} locale={locale} />;
          }

          const isDownload = link.type === "download";

          return (
            <a
              key={link.label}
              href={link.url}
              target={isDownload ? undefined : "_blank"}
              rel={isDownload ? undefined : "noopener noreferrer"}
              download={isDownload || undefined}
              className="group"
            >
              <div className="flex items-center justify-between py-5 border-b border-[#3d2b1f]/5 group-hover:border-[#b85c38]/20 transition-colors">
                <div>
                  <p className="text-xs text-[#3d2b1f]/30 mb-1 tracking-wide">{link.label}</p>
                  <p className="text-lg text-[#3d2b1f]/70 group-hover:text-[#b85c38]/80 transition-colors font-light">
                    {link.value}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-[#3d2b1f]/5 flex items-center justify-center text-[#3d2b1f]/20 group-hover:border-[#b85c38]/30 group-hover:text-[#b85c38]/50 transition-all group-hover:scale-110">
                  {isDownload ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Decorative circles */}
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
        {content.tagline}
      </p>
    </SectionContainer>
  );
}
