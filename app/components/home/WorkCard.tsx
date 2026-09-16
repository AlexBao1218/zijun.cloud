import Image from "next/image";
import { Link } from "@/i18n/routing";
import OffsetBox from "@/app/components/OffsetBox";
import { BG_CLASS, TINT_CLASS, type WorkCardData } from "@/lib/projects";

/* The card is its own query container: type and padding scale with its width (cqw against the 416px reference) and floor at the phone sizes. */
const CELL = "px-[max(12px,3.365cqw)] py-[max(10px,2.885cqw)]";
const META = "text-[length:max(13px,3.365cqw)]";

export default function WorkCard({ card }: { card: WorkCardData }) {
  return (
    <OffsetBox blockClass={BG_CLASS[card.colour]} className="@container">
      <Link href={`/projects/${card.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
        <div className={`${CELL} border-b border-ink ${META}`}>{card.duration}</div>
        <div className={`relative aspect-[16/10] border-b border-ink overflow-hidden ${card.cover ? TINT_CLASS[card.colour] : "hatch"}`}>
          {card.cover && (
            /* Screenshot in a slight 3-D tilt, falling off the card's right and bottom edges. */
            <div className="absolute left-[10%] top-[10%] w-[130%] h-[130%] border border-ink bg-white origin-left [transform:perspective(700px)_rotateY(-16deg)_rotateX(4deg)]">
              <Image src={card.cover} alt="" fill sizes="(min-width: 1280px) 540px, 460px" className="object-cover object-left-top" />
            </div>
          )}
        </div>
        <h3 className={`${CELL} border-b border-ink font-serif text-[length:max(24px,7.21cqw)] leading-tight`}>{card.title}</h3>
        <div className={`${CELL} border-b border-ink ${META}`}>{card.org}</div>
        <div className={`${CELL} ${META} text-ink/70`}>{card.role}</div>
      </Link>
    </OffsetBox>
  );
}
