import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import WorkCard from "./WorkCard";
import type { WorkCardData, WorkGroup } from "@/lib/projects";

type WorkContent = { title: string; subtitle: string; groups: WorkGroup[]; cards: WorkCardData[] };

export default async function WorkGrid({ locale }: { locale: string }) {
  const c = await loadContent<WorkContent>("work", locale);
  const bySlug = new Map(c.cards.map((card) => [card.slug, card]));
  return (
    <section>
      <SectionStarter id="work" title={c.title} subtitle={c.subtitle} />
      <div className="px-6 md:px-16 py-16 md:py-24 max-w-[1400px] mx-auto grid gap-20 md:gap-24">
        {c.groups.map((g) => (
          <div key={g.name} className="grid gap-10">
            <div className="flex items-baseline gap-4 border-b border-ink pb-3">
              <h3 className="font-serif text-3xl md:text-4xl leading-none">{g.name}</h3>
              <span className="text-[12px] md:text-[13px] text-ink/60">{g.note}</span>
            </div>
            <ul className="flex flex-wrap gap-x-10 gap-y-14">
              {g.slugs.map((slug) => {
                const card = bySlug.get(slug);
                return card ? (
                  <li key={slug} className="w-full max-w-[22rem]">
                    <WorkCard card={card} />
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
