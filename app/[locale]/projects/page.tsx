import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import { Link } from "@/i18n/routing";
import SectionContainer from "@/app/components/SectionContainer";
import PageHeader from "@/app/components/PageHeader";

type ProjectItem = {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  year: string;
  type: string;
};

type ProjectsIndexContent = {
  eyebrow: string;
  projects: ProjectItem[];
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const content = await loadContent<ProjectsIndexContent>("projects/_index", locale);

  return (
    <SectionContainer className="pb-16 md:pb-20">
      <PageHeader
        eyebrow={content.eyebrow}
        title={t("title")}
        subtitle={t("subtitle")}
        subtitleClassName="text-sm md:text-base text-[#3d2b1f]/40 mb-10 md:mb-12"
      />

      <div className="space-y-0">
        {content.projects.map((project, index) => (
          <div key={project.slug}>
            {index > 0 && (
              <div className="h-px bg-[#3d2b1f]/5 my-4 md:my-6" />
            )}

            <Link
              href={`/projects/${project.slug}`}
              className="group block -mx-4 px-4 py-3 hover:bg-[#3d2b1f]/[0.02] rounded-lg transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6 mb-1">
                <h2 className="font-serif text-base md:text-lg lg:text-xl font-medium text-[#3d2b1f] group-hover:text-[#b85c38]/80 transition-colors">
                  {project.title}
                </h2>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#3d2b1f]/30 shrink-0">
                  <span className="hidden md:inline">{project.year}</span>
                  <span className="hidden md:inline text-[#3d2b1f]/15">·</span>
                  <span className="text-[#b85c38]/50">{project.type}</span>
                </div>
              </div>
              <p className="text-sm md:text-base text-[#3d2b1f]/45 mb-1 md:mb-2">
                {project.tagline}
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
    </SectionContainer>
  );
}
