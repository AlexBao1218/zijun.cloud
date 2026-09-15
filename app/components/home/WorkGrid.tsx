import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import WorkCard from "./WorkCard";
import type { WorkCardData, WorkGroup } from "@/lib/projects";

type WorkContent = { title: string; subtitle: string; groups: WorkGroup[]; cards: WorkCardData[] };

function GroupHeading({ g, compact }: { g: WorkGroup; compact?: boolean }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-ink pb-3 whitespace-nowrap">
      <h3 className={`font-serif leading-none ${compact ? "text-3xl" : "text-3xl md:text-4xl"}`}>{g.name}</h3>
      <span className="text-[12px] md:text-[13px] text-ink/60">{g.note}</span>
    </div>
  );
}

/** Groups with several cards get a full-width block; single-card groups share one row, each with its own heading. */
export default async function WorkGrid({ locale }: { locale: string }) {
  const c = await loadContent<WorkContent>("work", locale);
  const bySlug = new Map(c.cards.map((card) => [card.slug, card]));
  const multi = c.groups.filter((g) => g.slugs.length > 1);
  const single = c.groups.filter((g) => g.slugs.length === 1);

  return (
    <section>
      <SectionStarter id="work" title={c.title} subtitle={c.subtitle} />
      <div className="px-6 md:px-16 py-16 md:py-24 max-w-[1400px] mx-auto grid gap-20 md:gap-24">
        {multi.map((g) => (
          <div key={g.name} className="grid gap-10">
            <GroupHeading g={g} />
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
        {single.length > 0 && (
          <ul className="flex flex-wrap gap-x-10 gap-y-14">
            {single.map((g) => {
              const card = bySlug.get(g.slugs[0]);
              return card ? (
                <li key={g.name} className="w-full max-w-[22rem] grid gap-10 content-start">
                  <GroupHeading g={g} compact />
                  <WorkCard card={card} />
                </li>
              ) : null;
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
