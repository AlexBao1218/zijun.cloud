type Props = { id: string; title: string; subtitle: string };

export default function SectionStarter({ id, title, subtitle }: Props) {
  return (
    <div
      id={id}
      className="scroll-mt-14 md:scroll-mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-y border-ink px-5 md:px-10 py-4"
    >
      <h2 className="font-serif text-3xl md:text-4xl leading-none">{title}</h2>
      <p className="text-[12px] md:text-[13px] text-ink/70">{subtitle}</p>
    </div>
  );
}
