import Image from "next/image";
import { loadContent } from "@/lib/content";

type HomeContent = {
  availability: string;
  quote: string;
  attribution: string;
  attributionEmphasis: string;
  byline: string;
  image?: { src: string; alt: string };
};

/** Hero: an overheard line in serif, its attribution, and a one-line byline. Copy lives in content/home. */
export default async function Hero({ locale }: { locale: string }) {
  const c = await loadContent<HomeContent>("home", locale);

  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 px-6 md:px-20 pt-32 pb-20 md:pt-[calc(5rem+4rem)] md:pb-16 md:min-h-[calc(100svh-6.5rem)]">
      <div className="max-w-[46ch]">
        <p className="text-[12px] md:text-[13px] tracking-[0.14em] uppercase mb-8">{c.availability}</p>
        <h1 className="font-serif font-normal text-[34px] md:text-[44px] leading-[1.1] text-balance">{c.quote}</h1>
        <p className="mt-4 font-serif italic text-[18px] md:text-[21px] leading-snug text-ink/80">
          {c.attribution}{" "}
          <span className="not-italic text-ink text-[30px] md:text-[40px] leading-none align-baseline">{c.attributionEmphasis}</span>
        </p>
        <p className="mt-10 text-[14px] md:text-[15px] leading-relaxed">{c.byline}</p>
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
