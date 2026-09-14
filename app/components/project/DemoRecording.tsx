import Image from "next/image";

type Props = { video?: string; poster?: string; url?: string; note: string; openLabel: string };

export default function DemoRecording({ video, poster, url, note, openLabel }: Props) {
  if (video) {
    return (
      <div className="border border-ink">
        <video controls playsInline muted loop preload="metadata" poster={poster} className="block w-full">
          <source src={video} type="video/mp4" />
        </video>
      </div>
    );
  }
  return (
    <div className="border border-ink">
      <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
        {poster ? <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
        <span className="text-ink/70">{note}</span>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
            {openLabel}
          </a>
        )}
      </div>
    </div>
  );
}
