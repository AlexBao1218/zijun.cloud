/** A hand-drawn open toolbox: the handle and latch in SVG, the lid as the tray's rounded top edge, tags inside the tray. */
export default function Toolbox({ name, note, items, accent }: { name: string; note: string; items: string[]; accent: string }) {
  const stroke = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <figure className="m-0 grid justify-items-center w-full">
      {/* handle */}
      <svg viewBox="0 0 120 34" width="120" height="34" aria-hidden="true" className="-mb-px">
        <defs>
          <filter id={`wob-${accent}`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="5" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#wob-${accent})`}>
          <path d="M20 33v-14q0-8 8-8h64q8 0 8 8v14" {...stroke} />
          <path d="M12 33h96" {...stroke} strokeWidth={2} />
        </g>
      </svg>
      {/* tray with lid edge */}
      <div className="relative w-full border border-ink border-t-2 rounded-t-[14px] bg-paper px-5 pt-6 pb-6 grid gap-4">
        <span aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 -top-[2px] h-2.5 w-6" style={{ background: `var(--proj-${accent})` }} />
        <figcaption className="flex items-baseline justify-between gap-4 flex-wrap">
          <span className="font-serif text-2xl leading-none">{name}</span>
          <span className="text-[11px] tracking-[0.12em] uppercase text-ink/60">{note}</span>
        </figcaption>
        <ul className="flex flex-wrap gap-2.5">
          {items.map((item) => (
            <li key={item} className="border border-ink bg-fill px-3 py-2 text-[13px] font-medium">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
