import Image from "next/image";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import { Link, routing } from "@/i18n/routing";
import OffsetBox from "@/app/components/OffsetBox";
import DemoFrame from "@/app/components/project/DemoFrame";
import DemoRecording from "@/app/components/project/DemoRecording";
import DemoStatic from "@/app/components/project/DemoStatic";
import GuideFlow from "@/app/components/project/GuideFlow";
import Sketch from "@/app/components/project/Sketch";
import { SKETCH_COMPONENTS } from "@/app/components/project/sketches";
import { BG_CLASS, BORDER_CLASS, UNDERLINE_CLASS, type ProjectContent } from "@/lib/projects";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "projects");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const slugs = entries.filter((e) => e.isDirectory() && !e.name.startsWith("_")).map((e) => e.name);
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function loadProject(slug: string, locale: string): Promise<ProjectContent> {
  try {
    return await loadContent<ProjectContent>(`projects/${slug}`, locale);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") notFound();
    throw e;
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = await loadProject(slug, locale);
  return { title: `${p.title} — Alex Bao`, description: p.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("project");
  const p = await loadProject(slug, locale);
  const demoHref = p.demo.mode !== "static" ? p.demo.url ?? p.links[0]?.url : undefined;
  const otherLinks = p.links.filter((l) => l.url !== demoHref);

  return (
    <main className="pt-16 md:pt-20">
      <div className="px-6 md:px-16 xl:px-28 pt-10 md:pt-16 pb-20 md:pb-32 max-w-[1240px] xl:max-w-[1560px] mx-auto grid gap-12 md:gap-16 xl:gap-20">
        <Link href={{ pathname: "/", hash: "work" }} className="text-[12px] underline underline-offset-4 justify-self-start">
          {t("back")}
        </Link>

        {/* Header card */}
        <OffsetBox blockClass={BG_CLASS[p.colour]}>
          <div className="grid md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="px-5 md:px-8 py-6 md:py-8 border-b md:border-b-0 md:border-r border-ink">
              <h1 className={`font-serif text-4xl md:text-6xl leading-none underline decoration-[6px] underline-offset-[10px] ${UNDERLINE_CLASS[p.colour]}`}>
                {p.title}
              </h1>
              <p className="mt-6 text-[13px]">{p.org}</p>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-1 text-[12px]">
              <div className="px-5 py-3 border-b border-ink md:min-w-[220px]">
                <dt className="text-ink/60 uppercase tracking-[0.14em] text-[10px]">{t("when")}</dt>
                <dd className="mt-1">{p.duration}</dd>
              </div>
              <div className="px-5 py-3 border-b border-ink border-l md:border-l-0">
                <dt className="text-ink/60 uppercase tracking-[0.14em] text-[10px]">{t("role")}</dt>
                <dd className="mt-1">{p.role}</dd>
              </div>
            </dl>
          </div>
        </OffsetBox>

        <p className="max-w-[70ch] text-[16px] md:text-[17px] xl:text-[19px] leading-relaxed">{p.summary}</p>

        {/* Links row */}
        {(demoHref || otherLinks.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {demoHref && (
              <OffsetBox blockClass="bg-ink" offset={8} className="inline-block">
                <a href={demoHref} target="_blank" rel="noopener noreferrer" className="block bg-fill px-4 py-2.5 text-[13px] font-medium">
                  {t("openDemo")}
                </a>
              </OffsetBox>
            )}
            {otherLinks.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-[13px] underline underline-offset-4 decoration-1 hover:decoration-2">
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* Demo */}
        {p.demo.mode === "embed" && p.demo.url && (
          <DemoFrame
            url={p.demo.url}
            title={p.title}
            height={p.demo.height}
            width={p.demo.width}
            poster={p.demo.poster}
            openLabel={t("openDemo")}
            mobileNote={t("mobileNote")}
          />
        )}
        {p.demo.mode === "recording" && (
          <DemoRecording video={p.demo.video} poster={p.demo.poster} url={p.demo.url} note={t("recordingNote")} openLabel={t("openDemo")} />
        )}
        {p.demo.mode === "static" && p.demo.poster && <DemoStatic poster={p.demo.poster} alt={p.title} />}

        {p.guide && <GuideFlow heading={p.guide.heading} steps={p.guide.steps} />}

        {/* Facts */}
        <dl className="grid sm:grid-cols-2 border border-ink">
          {p.facts.map((f, i) => (
            <div key={i} className="px-4 py-3 border-b border-ink last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-ink/60">{f.label}</dt>
              <dd className="mt-1 text-[13px]">{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* Sections: heading in the margin from xl, prose beside it at a reading measure, figures span both columns */}
        <div className="grid gap-12 xl:gap-20">
          {p.sections.map((s, i) => (
            <section key={i} className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-x-16 xl:gap-y-10">
              <h2 className="font-serif text-3xl leading-none">{s.heading}</h2>
              <div className="grid gap-4 max-w-[72ch] xl:max-w-[78ch]">
                {s.paragraphs.map((para, j) => (
                  <p key={j} className="text-[14px] md:text-[15px] xl:text-[17px] leading-relaxed">{para}</p>
                ))}
                {s.bullets && (
                  <ul className="grid gap-1.5 pl-5 list-disc text-[14px] xl:text-[15px] leading-relaxed">
                    {s.bullets.map((b, k) => <li key={k}>{b}</li>)}
                  </ul>
                )}
                {s.quote && (
                  <blockquote className={`border-l-4 pl-4 py-1 text-[13px] text-ink/80 ${BORDER_CLASS[p.colour]}`}>{s.quote}</blockquote>
                )}
              </div>
              {s.image && (
                <div className="relative border border-ink overflow-hidden aspect-[16/9] xl:col-span-2">
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1280px) 1336px, 100vw" className="object-cover object-top" />
                </div>
              )}
              {s.sketch && (() => {
                const { Component, label } = SKETCH_COMPONENTS[s.sketch];
                return (
                  <div className="min-w-0 xl:col-span-2">
                    <Sketch label={label}>
                      <Component />
                    </Sketch>
                  </div>
                );
              })()}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="border-t border-ink pt-6 grid gap-3">
          <h2 className="text-[11px] tracking-[0.14em] uppercase text-ink/60">{t("stack")}</h2>
          <ul className="flex flex-wrap gap-2">
            {p.tags.map((tag, i) => (
              <li key={i} className="border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium">{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
