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
      <div className="px-6 md:px-20 py-16 md:py-24 max-w-[1100px] mx-auto grid gap-14">
        {c.groups.map((g) => (
          <div key={g.name} className="grid gap-5 justify-items-center">
            <h3 className="font-serif text-3xl leading-none">{g.name}</h3>
            <ul className="flex flex-wrap justify-center gap-3">
              {g.items.map((item) => (
                <li key={item} className="border border-ink bg-fill px-3 py-2 text-[13px] font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="grid gap-3 justify-items-center border-t border-ink pt-10">
          <h3 className="font-serif text-3xl leading-none">{c.languagesLabel}</h3>
          <p className="text-[14px] text-center">{c.languages}</p>
        </div>
      </div>
    </section>
  );
}
