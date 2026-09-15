/**
 * A toolbox built from the site's own vocabulary — ink rules, paper, one small accent:
 * an arched handle, a lid that carries the label plate, two latches over the seam, a deep tray for the tags, and feet.
 */
export default function Toolbox({ name, note, items, accent }: { name: string; note: string; items: string[]; accent: string }) {
  const accentBg = { background: `var(--proj-${accent})` } as const;
  return (
    <figure className="m-0 w-full grid justify-items-center">
      {/* handle */}
      <svg viewBox="0 0 120 30" width="120" height="30" aria-hidden="true" className="block -mb-px">
        <path d="M14 30V16q0-9 9-9h74q9 0 9 9v14" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 30V22M106 30V22" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="relative w-full">
        {/* lid */}
        <figcaption className="relative flex items-center justify-between gap-4 border border-ink rounded-t-[10px] bg-fill px-5 h-11">
          <span className="font-serif text-2xl xl:text-3xl leading-none">{name}</span>
          <span className="hidden sm:inline text-[11px] tracking-[0.12em] uppercase text-ink/60">{note}</span>
          {/* hinge marks */}
          <span aria-hidden="true" className="absolute left-3 -top-px h-[3px] w-4 bg-ink" />
          <span aria-hidden="true" className="absolute right-3 -top-px h-[3px] w-4 bg-ink" />
        </figcaption>

        {/* latches over the seam */}
        <span aria-hidden="true" className="absolute left-[22%] top-[38px] z-10 h-4 w-5 border border-ink" style={accentBg} />
        <span aria-hidden="true" className="absolute right-[22%] top-[38px] z-10 h-4 w-5 border border-ink" style={accentBg} />

        {/* tray */}
        <div className="border border-ink border-t-0 bg-paper px-5 pt-7 pb-6">
          <ul className="flex flex-wrap gap-2.5">
            {items.map((item) => (
              <li key={item} className="border border-ink bg-fill px-3 py-2 text-[13px] xl:text-[15px] xl:px-3.5 xl:py-2.5 font-medium">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* feet */}
        <span aria-hidden="true" className="absolute left-4 -bottom-1 h-1 w-6 bg-ink" />
        <span aria-hidden="true" className="absolute right-4 -bottom-1 h-1 w-6 bg-ink" />
      </div>
    </figure>
  );
}
