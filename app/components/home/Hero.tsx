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
  // "conjunction"/"narrow" separates without a conjunction in both locales:
  // en -> "a, b, c", zh -> "a、b、c". ("unit" joins with no separator at all in zh.)
  const list = new Intl.ListFormat(locale, { type: "conjunction", style: "narrow" }).format(
    c.identities
  );

  return (
    <section className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 md:gap-16 items-center px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-[60ch]">
        <p className="text-[11px] md:text-[12px] tracking-[0.14em] uppercase mb-5">{c.availability}</p>
        <h1 className="text-[15px] md:text-[17px] leading-relaxed font-normal">
          <span className="font-serif italic text-[1.35em] leading-none">{c.lead}</span>{" "}
          {list}
          {c.closing}
        </h1>
      </div>
      {c.image?.src ? (
        <div className="relative border border-ink aspect-[2/3] w-full max-w-[300px] md:justify-self-end overflow-hidden">
          <Image src={c.image.src} alt={c.image.alt} fill preload sizes="(min-width: 768px) 300px, 100vw" className="object-cover" />
        </div>
      ) : (
        /* Intro image slot — hatch placeholder until content/home.image is set. */
        <div aria-hidden="true" className="hidden md:block hatch border border-ink aspect-[4/5] w-full max-w-[280px] justify-self-end" />
      )}
    </section>
  );
}
