import { setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import { Link } from "@/i18n/routing";
import SectionContainer from "@/app/components/SectionContainer";
import TagList from "@/app/components/TagList";
import fs from "fs/promises";
import path from "path";

type ProjectSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type ProjectContent = {
  title: string;
  meta: {
    year: string;
    role: string;
    url?: string;
    urlLabel?: string;
  };
  description: string;
  sections: ProjectSection[];
  tags: string[];
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const projectsDir = path.join(process.cwd(), "content", "projects");
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isDirectory() && e.name !== "_index")
    .map((e) => e.name);

  const locales = ["en", "zh"];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";
  const content = await loadContent<ProjectContent>(`projects/${slug}`, locale);

  return (
    <SectionContainer>
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-[#3d2b1f]/30 hover:text-[#3d2b1f]/55 transition-colors mb-8 md:mb-12"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        {isEN ? "Back to Projects" : "返回项目列表"}
      </Link>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 text-sm text-[#3d2b1f]/35 mb-6">
          <span>{content.meta.year}</span>
          <span className="text-[#3d2b1f]/15">·</span>
          <span className="text-[#b85c38]/50">{content.meta.role}</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-[#3d2b1f] mb-4">
          {content.title}
        </h1>
        <p className="text-lg text-[#3d2b1f]/45 leading-relaxed max-w-lg">
          {content.description}
        </p>
      </div>

      {/* Project Link */}
      {content.meta.url && (
        <a
          href={content.meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base text-[#b85c38]/60 hover:text-[#b85c38]/80 transition-colors mb-16"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          {content.meta.urlLabel}
        </a>
      )}

      {/* Sections */}
      {content.sections.map((section, i) => (
        <section key={i} className="mb-12">
          <h2 className="text-xl font-medium text-[#3d2b1f]/80 mb-5">
            {section.heading}
          </h2>
          <div className="space-y-5 text-base text-[#3d2b1f]/55 leading-relaxed">
            {section.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {section.bullets && (
              <ul className="space-y-2 list-disc list-inside text-base text-[#3d2b1f]/55 pl-2">
                {section.bullets.map((b, k) => (
                  <li key={k}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      {/* Tags */}
      <div className="pt-10 border-t border-[#3d2b1f]/5">
        <TagList tags={content.tags} size="base" />
      </div>
    </SectionContainer>
  );
}
