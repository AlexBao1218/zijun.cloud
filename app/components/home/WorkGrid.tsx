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
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto">
        {c.cards.map((card) => (
          <li key={card.slug}>
            <WorkCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
}
