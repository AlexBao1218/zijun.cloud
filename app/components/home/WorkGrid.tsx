import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import WorkCard from "./WorkCard";
import Showcase from "./Showcase";
import type { WorkCardData, WorkGroup } from "@/lib/projects";

type WorkContent = {
  title: string;
  subtitle: string;
  groups: WorkGroup[];
  cards: WorkCardData[];
  /** How single-card groups are laid out: side by side, or as a record-picker showcase. */
  singles?: "row" | "carousel";
  showcaseLabel?: string;
};

/** Width of three cards plus two gaps — group headings are capped to it so they align with the centred rows. */
const ROW_MAX = "max-w-[calc(3*22rem+2*2.5rem)] xl:max-w-[calc(3*26rem+2*3.5rem)]";

function GroupHeading({ g, compact }: { g: WorkGroup; compact?: boolean }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-ink pb-3 whitespace-nowrap">
      <h3 className={`font-serif leading-none ${compact ? "text-3xl xl:text-4xl" : "text-3xl md:text-4xl xl:text-5xl"}`}>{g.name}</h3>
      <span className="text-[12px] md:text-[13px] xl:text-[15px] text-ink/60">{g.note}</span>
    </div>
  );
}

export default async function WorkGrid({ locale }: { locale: string }) {
  const c = await loadContent<WorkContent>("work", locale);
  const bySlug = new Map(c.cards.map((card) => [card.slug, card]));
  const multi = c.groups.filter((g) => g.slugs.length > 1);
  const single = c.groups.filter((g) => g.slugs.length === 1);
  const singleItems = single.flatMap((g) => {
    const card = bySlug.get(g.slugs[0]);
    return card ? [{ group: g, card }] : [];
  });

  return (
    <section>
      <SectionStarter id="work" title={c.title} subtitle={c.subtitle} />
      <div className="px-6 md:px-16 xl:px-28 py-16 md:py-24 xl:py-32 max-w-[1700px] mx-auto grid gap-20 md:gap-24 xl:gap-32 justify-items-center">
        {multi.map((g) => (
          <div key={g.name} className={`w-full ${ROW_MAX} grid gap-10`}>
            <GroupHeading g={g} />
            <ul className="flex flex-wrap justify-center gap-x-10 xl:gap-x-14 gap-y-14">
              {g.slugs.map((slug) => {
                const card = bySlug.get(slug);
                return card ? (
                  <li key={slug} className="w-full max-w-[22rem] xl:max-w-[26rem]">
                    <WorkCard card={card} />
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        ))}
        {singleItems.length > 0 && c.singles === "carousel" ? (
          <div className="w-full max-w-[1240px] xl:max-w-[1500px]">
            <Showcase items={singleItems} openLabel={c.showcaseLabel ?? "open →"} />
          </div>
        ) : (
          singleItems.length > 0 && (
            <ul className={`w-full ${ROW_MAX} flex flex-wrap justify-center gap-x-10 gap-y-14`}>
              {singleItems.map(({ group, card }) => (
                <li key={group.name} className="w-full max-w-[22rem] xl:max-w-[26rem] grid gap-10 content-start">
                  <GroupHeading g={group} compact />
                  <WorkCard card={card} />
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </section>
  );
}
