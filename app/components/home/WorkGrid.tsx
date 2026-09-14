import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import WorkCard from "./WorkCard";
import type { WorkCardData } from "@/lib/projects";

type WorkContent = { title: string; subtitle: string; cards: WorkCardData[] };

export default async function WorkGrid({ locale }: { locale: string }) {
  const c = await loadContent<WorkContent>("work", locale);
  return (
    <section>
      <SectionStarter id="work" title={c.title} subtitle={c.subtitle} />
      <ul className="flex flex-wrap justify-evenly gap-x-8 gap-y-16 px-6 md:px-16 py-16 md:py-24 max-w-[1400px] mx-auto">
        {c.cards.map((card) => (
          <li key={card.slug} className="w-full max-w-[22rem]">
            <WorkCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
}
