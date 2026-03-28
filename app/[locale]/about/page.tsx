import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import SectionContainer from "@/app/components/SectionContainer";
import PageHeader from "@/app/components/PageHeader";
import TagList from "@/app/components/TagList";

type AboutContent = {
  eyebrow: string;
  paragraphs: string[];
  skillsLabel: string;
  skills: string[];
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const content = await loadContent<AboutContent>("about", locale);

  return (
    <SectionContainer>
      <PageHeader eyebrow={content.eyebrow} title={t("title")} subtitle={t("subtitle")} />

      <div className="space-y-6 md:space-y-8 text-[#3d2b1f]/60 leading-relaxed text-sm md:text-base">
        {content.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <div className="pt-8 border-t border-[#3d2b1f]/5">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#b85c38]/50 mb-5">
            {content.skillsLabel}
          </p>
          <TagList tags={content.skills} />
        </div>
      </div>
    </SectionContainer>
  );
}
