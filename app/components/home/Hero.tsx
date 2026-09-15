import Image from "next/image";
import { loadContent } from "@/lib/content";

type HomeContent = {
  availability: string;
  lead: string;
  identities: string[];
  closing: string;
  image?: { src: string; alt: string };
};

export default async function Hero({ locale }: { locale: string }) {
  const c = await loadContent<HomeContent>("home", locale);
  // conjunction/narrow gives "a, b, c" in en and "a、b、c" in zh — a separator without a conjunction.
  const list = new Intl.ListFormat(locale, { type: "conjunction", style: "narrow" }).format(c.identities);

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 px-6 md:px-20 pt-32 pb-20 md:pt-[calc(5rem+4rem)] md:pb-16 md:min-h-[calc(100svh-6.5rem)]">
      <div className="max-w-[44ch]">
        <p className="text-[12px] md:text-[13px] tracking-[0.14em] uppercase mb-6">{c.availability}</p>
        <h1 className="text-[17px] md:text-[20px] leading-relaxed font-normal">
          <span className="font-serif italic text-[1.35em] leading-none">{c.lead}</span> {list}
          {c.closing}
        </h1>
      </div>
      {c.image?.src ? (
        <div className="relative border border-ink aspect-[2/3] w-[260px] md:w-[340px] shrink-0 overflow-hidden">
          <Image src={c.image.src} alt={c.image.alt} fill preload sizes="340px" className="object-cover" />
        </div>
      ) : (
        /* Intro image slot — hatch placeholder until content/home.image is set. */
        <div aria-hidden="true" className="hidden md:block hatch border border-ink aspect-[2/3] w-[340px] shrink-0" />
      )}
    </section>
  );
}
