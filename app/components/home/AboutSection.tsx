import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import PhotoRow from "./PhotoRow";

type AboutContent = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  photosIntro: string;
  photos: { src: string; alt: string }[];
};

export default async function AboutSection({ locale }: { locale: string }) {
  const c = await loadContent<AboutContent>("about", locale);
  return (
    <section>
      <SectionStarter id="about" title={c.title} subtitle={c.subtitle} />
      <div className="px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto grid gap-10">
        <div className="max-w-[68ch] grid gap-5 text-[14px] md:text-[15px] leading-relaxed">
          {c.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="text-[13px] text-ink/70">{c.photosIntro}</p>
        <PhotoRow photos={c.photos} />
      </div>
    </section>
  );
}
