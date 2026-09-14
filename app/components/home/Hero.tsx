import { loadContent } from "@/lib/content";

type HomeContent = { availability: string; lead: string; identities: string[]; closing: string };

export default async function Hero({ locale }: { locale: string }) {
  const c = await loadContent<HomeContent>("home", locale);
  const list = c.identities.join(", ");

  return (
    <section className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 md:gap-16 items-center px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-[60ch]">
        <p className="text-[11px] md:text-[12px] tracking-[0.14em] uppercase mb-5">{c.availability}</p>
        <p className="text-[15px] md:text-[17px] leading-relaxed">
          <span className="font-serif italic text-[1.35em] leading-none">{c.lead}</span>{" "}
          {list}, {c.closing}
        </p>
      </div>
      {/* Intro image slot — intentionally empty until Alex picks an image. */}
      <div aria-hidden="true" className="hidden md:block hatch border border-ink aspect-[4/5] w-full max-w-[280px] justify-self-end" />
    </section>
  );
}
