import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  return (
    <main className="pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-24">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-4">
          {locale === "en" ? "Writing" : "随笔"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-3">
          {t("title")}
        </h1>
        <p className="text-sm md:text-base text-[#3d2b1f]/40 mb-12 md:mb-16">{t("subtitle")}</p>

        <div className="space-y-6 md:space-y-8">
          <p className="text-base md:text-lg text-[#3d2b1f]/35 leading-relaxed">
            {locale === "en"
              ? "Blog posts coming soon. Topics will include AI learning notes, daily reflections, and growth tracking."
              : "博客文章即将上线。主题将包括 AI 学习笔记、日常思考和成长追踪。"}
          </p>
        </div>
      </div>
    </main>
  );
}
