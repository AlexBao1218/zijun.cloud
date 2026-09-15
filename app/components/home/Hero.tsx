import Image from "next/image";
import { loadContent } from "@/lib/content";

type HomeContent = {
  availability: string;
  quoteBefore: string;
  quoteEmphasis: string;
  quoteAfter: string;
  attribution: string;
  punchLead: string;
  punchEmphasis: string;
  byline: string;
  image?: { src: string; alt: string };
};

/** Hero: the brief as an overheard line, then the punch — two numbers in the one accent the chrome allows. Copy lives in content/home. */
export default async function Hero({ locale }: { locale: string }) {
  const c = await loadContent<HomeContent>("home", locale);

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 px-6 md:px-20 pt-32 pb-20 md:pt-[calc(5rem+4rem)] md:pb-16 md:min-h-[calc(100svh-6.5rem)]">
      <div className="max-w-[46ch]">
        <h1 className="font-serif font-normal text-[32px] md:text-[40px] leading-[1.12] text-balance">
          {c.quoteBefore}
          <span className="text-pop">{c.quoteEmphasis}</span>
          {c.quoteAfter}
        </h1>
        <p className="mt-3 font-serif italic text-[17px] md:text-[19px] leading-snug text-ink/70">{c.attribution}</p>
        <p className="mt-8 font-serif leading-none flex items-baseline gap-3 flex-wrap">
          <span className="text-[30px] md:text-[40px]">{c.punchLead}</span>
          <span className="text-pop text-[72px] md:text-[108px] leading-[0.85] tracking-[-0.01em]">{c.punchEmphasis}</span>
        </p>
        <p className="mt-10 text-[14px] md:text-[15px] leading-relaxed max-w-[52ch]">{c.byline}</p>
        <p className="mt-8">
          <span className="inline-block border border-ink bg-fill px-3 py-2 text-[11px] md:text-[12px] tracking-[0.12em] uppercase">
            {c.availability}
          </span>
        </p>
      </div>
      {c.image?.src ? (
        <div className="relative border border-ink aspect-[2/3] w-[260px] md:w-[340px] shrink-0 overflow-hidden">
          <Image src={c.image.src} alt={c.image.alt} fill preload sizes="340px" className="object-cover" />
        </div>
      ) : (
        <div aria-hidden="true" className="hidden md:block hatch border border-ink aspect-[2/3] w-[340px] shrink-0" />
      )}
    </section>
  );
}
