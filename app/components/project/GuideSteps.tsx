type Props = { heading: string; steps: string[] };

export default function GuideSteps({ heading, steps }: Props) {
  return (
    <section className="border border-ink">
      <h2 className="font-serif text-2xl leading-none px-4 md:px-6 py-3 border-b border-ink">{heading}</h2>
      <ol className="grid">
        {steps.map((s, i) => (
          <li key={i} className="grid grid-cols-[48px_minmax(0,1fr)] border-b border-ink last:border-b-0">
            <span className="flex items-start justify-center pt-3 text-[12px] border-r border-ink font-medium tabular-nums">{i + 1}</span>
            <p className="px-4 py-3 text-[13px] leading-relaxed">{s}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
