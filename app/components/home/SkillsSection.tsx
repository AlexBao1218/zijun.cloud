import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";

type SkillsContent = {
  title: string;
  subtitle: string;
  /** A transcript excerpt: course rows with grades, then GPA / honours lines. */
  ledger?: { name: string; subtitle: string; rows: { course: string; grade: string }[]; footer: string[] };
  groups: { name: string; items: string[]; note?: string }[];
  languagesLabel: string;
  languages: string;
};

export default async function SkillsSection({ locale }: { locale: string }) {
  const c = await loadContent<SkillsContent>("skills", locale);
  return (
    <section>
      <SectionStarter id="skills" title={c.title} subtitle={c.subtitle} />
      <div className="px-6 md:px-20 py-16 md:py-24 max-w-[1100px] mx-auto grid gap-16">
        {c.ledger && (
          <div className="grid gap-5 justify-items-center">
            <h3 className="font-serif text-3xl leading-none">{c.ledger.name}</h3>
            <p className="text-[12px] text-ink/60 -mt-2">{c.ledger.subtitle}</p>
            <table className="w-full max-w-[640px] border border-ink text-[13px]">
              <tbody>
                {c.ledger.rows.map((r) => (
                  <tr key={r.course} className="border-b border-ink last:border-b-0">
                    <td className="px-4 py-2.5">{r.course}</td>
                    <td className="px-4 py-2.5 w-20 text-center font-serif text-[20px] leading-none border-l border-ink tabular-nums">{r.grade}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-ink bg-fill">
                  <td colSpan={2} className="px-4 py-3 text-[12px]">
                    {c.ledger.footer.join(" · ")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
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
            {g.note && <p className="text-[12px] text-ink/60 text-center">{g.note}</p>}
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
