import Image from "next/image";

export default function DemoStatic({ poster, alt }: { poster?: string; alt: string }) {
  return (
    <div className="relative aspect-[16/9] border border-ink overflow-hidden">
      {poster ? <Image src={poster} alt={alt} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
    </div>
  );
}
