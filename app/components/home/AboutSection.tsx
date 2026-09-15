import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import PhotoRow from "./PhotoRow";
import LifeMap from "./LifeMap";

type AboutContent = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  photosIntro: string;
  strips: { name: string; photos: { src: string; alt: string }[] }[];
  map?: { title: string; lede: string; aside: string; stops: { name: string; stage: string; lon: number; lat: number }[] };
};

export default async function AboutSection({ locale }: { locale: string }) {
  const c = await loadContent<AboutContent>("about", locale);
  return (
    <section>
      <SectionStarter id="about" title={c.title} subtitle={c.subtitle} />
      <div className="px-6 md:px-20 py-20 md:py-32 max-w-[1400px] mx-auto grid gap-12">
        {c.paragraphs.length > 0 && (
        <div className="max-w-[72ch] grid gap-6 text-[15px] md:text-[16px] leading-relaxed">
          {c.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        )}
        {c.map && (
          <div className="w-full">
            <LifeMap title={c.map.title} lede={c.map.lede} stops={c.map.stops} aside={c.map.aside} />
          </div>
        )}
        <p className="text-[14px] text-ink/70">{c.photosIntro}</p>
        <div className="grid gap-6">
          {c.strips.map((st) => (
            <PhotoRow key={st.name} photos={st.photos} />
          ))}
        </div>
      </div>
    </section>
  );
}
