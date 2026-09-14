import Image from "next/image";
import { Link } from "@/i18n/routing";
import OffsetBox from "@/app/components/OffsetBox";
import { BG_CLASS, type WorkCardData } from "@/lib/projects";

export default function WorkCard({ card }: { card: WorkCardData }) {
  return (
    <OffsetBox blockClass={BG_CLASS[card.colour]}>
      <Link href={`/projects/${card.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <div className="px-3.5 py-3 border-b border-ink text-[13px]">{card.duration}</div>
        <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
          {card.cover ? (
            <Image src={card.cover} alt="" fill sizes="352px" className="object-cover object-top" />
          ) : (
            <div className="hatch absolute inset-0" />
          )}
        </div>
        <h3 className="px-3.5 py-3 border-b border-ink font-serif text-[26px] leading-tight">{card.title}</h3>
        <div className="px-3.5 py-3 border-b border-ink text-[13px]">{card.org}</div>
        <div className="px-3.5 py-3 text-[13px] text-ink/70">
          {card.kind} / {card.role}
        </div>
      </Link>
    </OffsetBox>
  );
}
