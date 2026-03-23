import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

const projects = [
  {
    slug: "neochain",
    titleEn: "NeoChain WMS",
    titleZh: "NeoChain WMS",
    taglineEn: "AI-Powered Warehouse Management System",
    taglineZh: "AI 驱动的仓储管理系统",
    tags: ["Next.js", "TypeScript", "AI", "PDA", "Python"],
    year: "2025—Present",
    type: "Co-founder",
  },
  {
    slug: "igc",
    titleEn: "IGC — Digital Twin & AI Integration",
    titleZh: "IGC — 数字孪生与 AI 集成",
    taglineEn: "Building OS, RAG Knowledge Bases & ESG Analytics",
    taglineZh: "Building OS、RAG 知识库与 ESG 分析",
    tags: ["RAG", "API Design", "Digital Twin", "ESG"],
    year: "2025",
    type: "Intern",
  },
  {
    slug: "cathay-hackathon",
    titleEn: "Cathay Cargo ULD Optimizer",
    titleZh: "国泰货运 ULD 配载优化",
    taglineEn: "2D ULD Load Planning Platform · Finalist",
    taglineZh: "2D ULD 智能配载平台 · 决赛选手",
    tags: ["AI", "MILP", "Operations Research", "Vibe Coding"],
    year: "2025",
    type: "Hackathon",
  },
];

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const isEN = locale === "en";

  return (
    <main className="pt-24 md:pt-32 px-6 md:px-20 pb-16 md:pb-20">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] tracking-[0.3em] uppercase text-[#b85c38]/60 mb-4">
          {locale === "en" ? "Work" : "项目"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-3">
          {t("title")}
        </h1>
        <p className="text-sm md:text-base text-[#3d2b1f]/40 mb-10 md:mb-12">{t("subtitle")}</p>

        <div className="space-y-0">
          {projects.map((project, index) => (
            <div key={project.slug}>
              {/* Divider line */}
              {index > 0 && (
                <div className="h-px bg-[#3d2b1f]/5 my-4 md:my-6" />
              )}

              <Link
                href={`/projects/${project.slug}`}
                className="group block -mx-4 px-4 py-3 hover:bg-[#3d2b1f]/[0.02] rounded-lg transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6 mb-1">
                  <h2 className="font-serif text-base md:text-lg lg:text-xl font-medium text-[#3d2b1f] group-hover:text-[#b85c38]/80 transition-colors">
                    {isEN ? project.titleEn : project.titleZh}
                  </h2>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#3d2b1f]/30 shrink-0">
                    <span className="hidden md:inline">{project.year}</span>
                    <span className="hidden md:inline text-[#3d2b1f]/15">·</span>
                    <span className="text-[#b85c38]/50">{project.type}</span>
                  </div>
                </div>
                <p className="text-sm md:text-base text-[#3d2b1f]/45 mb-1 md:mb-2">
                  {isEN ? project.taglineEn : project.taglineZh}
                </p>
                <div className="flex flex-wrap gap-x-3 md:gap-x-5 gap-y-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs md:text-sm text-[#3d2b1f]/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
