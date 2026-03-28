import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import SectionContainer from "@/app/components/SectionContainer";
import PageHeader from "@/app/components/PageHeader";

type BlogContent = {
  eyebrow: string;
  placeholder: string;
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const content = await loadContent<BlogContent>("blog", locale);

  return (
    <SectionContainer>
      <PageHeader eyebrow={content.eyebrow} title={t("title")} subtitle={t("subtitle")} />

      <div className="space-y-6 md:space-y-8">
        <p className="text-base md:text-lg text-[#3d2b1f]/35 leading-relaxed">
          {content.placeholder}
        </p>
      </div>
    </SectionContainer>
  );
}
