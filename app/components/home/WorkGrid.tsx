import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import WorkCard from "./WorkCard";
import Showcase from "./Showcase";
import WorkHint from "./WorkHint";
import type { WorkCardData, WorkGroup } from "@/lib/projects";

type WorkContent = {
  title: string;
  subtitle: string;
  groups: WorkGroup[];
  cards: WorkCardData[];
  /** How single-card groups are laid out: side by side, or as a record-picker showcase. */
  singles?: "row" | "carousel";
  /** Heading over the showcase, so the single-card groups read as a sibling of the multi-card ones. */
  singlesHeading?: Pick<WorkGroup, "name" | "note">;
  showcaseLabel?: string;
  /** Handwritten note beside the first row of cards ("click\nto open a demo"); first line short so it fits the gutter. */
  hint?: string;
};

function GroupHeading({ g, compact }: { g: Pick<WorkGroup, "name" | "note">; compact?: boolean }) {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-baseline gap-x-4 gap-y-1 border-b border-ink pb-3 md:whitespace-nowrap">
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
      {/* work-scope declares --card / --gap / --row (globals.css): three cards always share one row from lg, the showcase card matches */}
      <div className="work-scope px-6 md:px-16 lg:px-[clamp(4rem,7vw,7rem)] py-16 md:py-24 xl:py-32 max-w-[1700px] mx-auto grid gap-20 md:gap-24 xl:gap-32 justify-items-center">
        {multi.map((g, i) => {
          const list = (
            <ul className="flex flex-wrap justify-center gap-x-10 gap-y-14 lg:grid lg:grid-cols-3 lg:gap-x-[var(--gap)]">
              {g.slugs.map((slug) => {
                const card = bySlug.get(slug);
                return card ? (
                  <li key={slug} data-work-card={slug} className="w-full max-w-[var(--card)] lg:max-w-none">
                    <WorkCard card={card} />
                  </li>
                ) : null;
              })}
            </ul>
          );
          return (
            <div key={g.name} className="w-full max-w-[var(--row)] grid gap-10">
              <GroupHeading g={g} />
              {i === 0 && c.hint ? <WorkHint text={c.hint}>{list}</WorkHint> : list}
            </div>
          );
        })}
        {singleItems.length > 0 && c.singles === "carousel" ? (
          <div className="w-full max-w-[var(--row)] grid gap-10">
            {c.singlesHeading && <GroupHeading g={c.singlesHeading} />}
            {/* phones: the showcase becomes a plain stack of heading / card / brief */}
            <ul className="md:hidden grid gap-14 justify-items-center">
              {singleItems.map(({ group, card }) => (
                <li key={group.name} className="w-full max-w-[var(--card)] grid gap-6 content-start">
                  <GroupHeading g={group} compact />
                  <WorkCard card={card} />
                  {card.brief && <p className="text-[13px] leading-relaxed">{card.brief}</p>}
                </li>
              ))}
            </ul>
            <div className="hidden md:block">
              <Showcase items={singleItems} openLabel={c.showcaseLabel ?? "open →"} />
            </div>
          </div>
        ) : (
          singleItems.length > 0 && (
            <ul className="w-full max-w-[var(--row)] flex flex-wrap justify-center gap-x-10 gap-y-14">
              {singleItems.map(({ group, card }) => (
                <li key={group.name} className="w-full max-w-[var(--card)] grid gap-10 content-start">
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
