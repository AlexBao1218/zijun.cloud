import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <main className="pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-24">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-4">
          {locale === "en" ? "Me" : "我"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-3">
          {t("title")}
        </h1>
        <p className="text-sm md:text-base text-[#3d2b1f]/40 mb-12 md:mb-16">{t("subtitle")}</p>

        <div className="space-y-6 md:space-y-8 text-[#3d2b1f]/60 leading-relaxed text-sm md:text-base">
          <p>
            {locale === "en"
              ? "I'm a student at the University of Hong Kong studying Industrial Engineering and Logistics Management. My passion lies at the intersection of AI and real-world operations — building systems that don't just look impressive in demos, but actually work in production environments."
              : "我是香港大学工业工程与物流管理专业的学生。我热爱 AI 与现实运营的交汇处——构建不仅在演示中令人印象深刻，而且能在实际生产环境中运行的系统。"}
          </p>
          <p>
            {locale === "en"
              ? "I've worked on everything from AI agents with RAG knowledge bases to warehouse management systems running in real factories. I've experienced the full arc: from startup pitches to factory floor research, from hackathon finals to enterprise API integrations."
              : "我做过 AI Agent 的 RAG 知识库，也做过在真实工厂运行的仓储管理系统。我经历了完整的弧线：从创业路演到工厂实地考察，从黑客松决赛到企业级 API 集成。"}
          </p>
          <p>
            {locale === "en"
              ? "Currently, I'm building NeoChain — a WMS system that brings intelligent operations to small and medium factories across China. The journey from generic ERP failures to focused, human-in-the-loop warehouse systems has been incredibly instructive."
              : "目前我正在构建 NeoChain —— 一个为华南中小型工厂带来智能运营的 WMS 系统。从通用 ERP 的失败教训，到专注于人机协作的仓储系统，这个过程让我受益匪浅。"}
          </p>
          <p>
            {locale === "en"
              ? "I'm particularly interested in AI-assisted development workflows, prompt engineering for production systems, and the practical challenges of deploying ML in resource-constrained environments."
              : "我对 AI 辅助开发工作流、生产系统的 Prompt 工程，以及在资源受限环境中部署 ML 的实际挑战特别感兴趣。"}
          </p>

          <div className="pt-8 border-t border-[#3d2b1f]/5">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#b85c38]/50 mb-5">
              {locale === "en" ? "Skills" : "技能"}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js",
                "TypeScript",
                "Python",
                "AI / LLM",
                "Prompt Engineering",
                "Cursor / Claude",
                "Vercel",
                "React",
                "Node.js",
                "Digital Twin",
                "WMS",
                "RAG",
                "Git",
              ].map((skill) => (
                <span
                  key={skill}
                  className="text-xs text-[#3d2b1f]/40 border border-[#3d2b1f]/8 px-3 py-1.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
