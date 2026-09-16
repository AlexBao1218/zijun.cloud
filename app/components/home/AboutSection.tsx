import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import PhotoRow from "./PhotoRow";
import PhotoNotes, { type PhotoNote } from "./PhotoNotes";
import LifeMap from "./LifeMap";

type AboutContent = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  photosIntro: string;
  strips: { name: string; title: string; text: string; photos: { src: string; alt: string }[] }[];
  notes?: PhotoNote[];
  map?: { title: string; lede: string; text: string; stops: { name: string; stage: string; lon: number; lat: number }[] };
};

export default async function AboutSection({ locale }: { locale: string }) {
  const c = await loadContent<AboutContent>("about", locale);
  const notes = c.notes ?? [];
  return (
    <section className="overflow-x-clip">
      <SectionStarter id="about" title={c.title} subtitle={c.subtitle} />
      <div className="px-6 md:px-20 xl:px-28 py-20 md:py-32 max-w-[1700px] mx-auto grid gap-12 xl:gap-16">
        {c.paragraphs.length > 0 && (
        <div className="max-w-[72ch] grid gap-6 text-[15px] md:text-[16px] leading-relaxed">
          {c.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        )}
        {c.map && (
          <div className="w-full">
            <LifeMap title={c.map.title} lede={c.map.lede} text={c.map.text} stops={c.map.stops} />
          </div>
        )}
        <p className="text-[14px] xl:text-[16px] text-ink/70">{c.photosIntro}</p>
        <PhotoNotes notes={notes}>
          <div className="grid gap-20 md:gap-28">
            {c.strips.map((st, i) => {
              const captions = notes.filter((n) => n.strip === i);
              return (
                <article key={st.name} className="grid gap-8">
                  <header className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-4 lg:gap-16 items-baseline">
                    <h3 className="font-serif text-3xl xl:text-4xl leading-none">{st.title}</h3>
                    <p className="max-w-[60ch] text-[14px] xl:text-[16px] leading-relaxed text-ink/80">{st.text}</p>
                  </header>
                  <PhotoRow photos={st.photos} strip={i} />
                  {/* phones have no gutter for the handwritten notes, so the place names go under the strip as captions */}
                  {captions.length > 0 && (
                    <ul className="md:hidden grid gap-2 font-hand text-[22px] leading-snug text-ink/80 -rotate-1 origin-left">
                      {captions.map((n, k) => (
                        <li key={k}>{n.text.split("\n").join(" · ")}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </PhotoNotes>
      </div>
    </section>
  );
}
