import type { GuideStep } from "@/lib/projects";

type Props = { heading: string; steps: GuideStep[] };

/** A very plain flowchart: bordered boxes joined by a hairline with an arrowhead. Row on wide screens, column on phones. */
export default function GuideFlow({ heading, steps }: Props) {
  return (
    <section className="grid gap-6">
      <h2 className="font-serif text-2xl leading-none">{heading}</h2>
      <ol className="flex flex-col md:flex-row md:items-stretch gap-0">
        {steps.map((s, i) => (
          <li key={i} className="flex flex-col md:flex-row md:flex-1 md:min-w-0 items-stretch">
            <div className="flex-1 border border-ink bg-paper px-4 py-3 grid content-start gap-1.5">
              <span className="text-[10px] tracking-[0.14em] uppercase text-ink/60">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[13px] font-medium leading-snug">{s.label}</span>
              {s.hint && <span className="font-serif italic text-[15px] leading-snug text-ink/75">{s.hint}</span>}
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="relative shrink-0 self-center md:self-auto md:flex md:items-center">
                {/* vertical connector (phone) */}
                <svg className="md:hidden block mx-auto" width="16" height="28" viewBox="0 0 16 28" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d="M8 0v22" />
                  <path d="M3 18l5 6 5-6" />
                </svg>
                {/* horizontal connector (desktop) */}
                <svg className="hidden md:block" width="36" height="16" viewBox="0 0 36 16" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d="M0 8h30" />
                  <path d="M25 3l6 5-6 5" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
