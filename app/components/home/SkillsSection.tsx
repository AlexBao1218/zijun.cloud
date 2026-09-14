import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";

type SkillsContent = {
  title: string;
  subtitle: string;
  groups: { name: string; items: string[] }[];
  languagesLabel: string;
  languages: string;
};

export default async function SkillsSection({ locale }: { locale: string }) {
  const c = await loadContent<SkillsContent>("skills", locale);
  return (
    <section>
      <SectionStarter id="skills" title={c.title} subtitle={c.subtitle} />
      <div className="px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto grid gap-10">
        {c.groups.map((g) => (
          <div key={g.name} className="grid md:grid-cols-[160px_minmax(0,1fr)] gap-3 md:gap-8 items-start">
            <h3 className="text-[11px] tracking-[0.14em] uppercase text-ink/60 pt-2">{g.name}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li key={item} className="border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="grid md:grid-cols-[160px_minmax(0,1fr)] gap-3 md:gap-8 items-baseline border-t border-ink pt-6">
          <h3 className="text-[11px] tracking-[0.14em] uppercase text-ink/60">{c.languagesLabel}</h3>
          <p className="text-[13px]">{c.languages}</p>
        </div>
      </div>
    </section>
  );
}
