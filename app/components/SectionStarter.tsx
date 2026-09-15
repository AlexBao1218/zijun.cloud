type Props = { id: string; title: string; subtitle: string };

/** Full-width bordered strip that opens a section; the anchor id lives here. */
export default function SectionStarter({ id, title, subtitle }: Props) {
  return (
    <div
      id={id}
      className="scroll-mt-16 md:scroll-mt-20 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-y border-ink px-6 md:px-20 xl:px-28 py-5 md:py-6 xl:py-8"
    >
      <h2 className="font-serif text-4xl md:text-5xl xl:text-6xl leading-none">{title}</h2>
      <p className="text-[13px] md:text-[15px] xl:text-[17px] text-ink/70">{subtitle}</p>
    </div>
  );
}
