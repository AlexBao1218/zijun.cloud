"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string; caption: string; size: "lg" | "md" | "sm" };
type Item = Photo | { text: string };
export type PrintRow = { items: Item[] };

/** Print widths as a share of the row, so the arrangement is the same on every desktop; text takes what a paragraph needs. */
const WIDTH: Record<Photo["size"], string> = { lg: "lg:w-[24%]", md: "lg:w-[17%]", sm: "lg:w-[13%]" };

/** Each print is tilted and lifted a little differently, in a fixed sequence so the page is the same on every visit. */
const TILT = [-2.5, 1.5, -1.5, 2, -1, 1];
const LIFT = [0, -28, 18, -10, 8, -20];

/**
 * Instax prints scattered around a paragraph, the way they would sit on a desk: paper border, a handwritten caption on
 * the bottom margin, each at its own slight tilt. Rows wrap on phones. Click a print to enlarge.
 */
export default function Prints({ rows }: { rows: PrintRow[] }) {
  const [open, setOpen] = useState<Photo | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastTrigger.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastTrigger.current?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="grid gap-20 lg:gap-28">
        {rows.map((row, r) => {
          let photoIndex = 0;
          return (
            <div key={r} className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-x-6 gap-y-10 lg:gap-x-8">
              {row.items.map((it, i) => {
                if ("text" in it) {
                  return (
                    <p key={i} className="w-full lg:w-[23%] lg:shrink-0 text-[15px] xl:text-[16px] leading-relaxed">
                      {it.text}
                    </p>
                  );
                }
                const n = photoIndex++;
                const k = i % TILT.length;
                return (
                  <figure
                    key={it.src}
                    data-strip={r}
                    data-photo={n}
                    className={`relative w-[calc(50%-0.75rem)] ${WIDTH[it.size]} shrink-0 bg-white border border-ink p-2 pb-10 xl:p-2.5 xl:pb-12 transition-transform duration-300 [transform:rotate(var(--tilt))] lg:[transform:translateY(var(--lift))_rotate(var(--tilt))] lg:hover:[transform:translateY(var(--lift))_rotate(0deg)] motion-reduce:transition-none`}
                    style={{ ["--tilt" as string]: `${TILT[k]}deg`, ["--lift" as string]: `${LIFT[k]}px` }}
                  >
                    {it.src ? (
                      <button
                        type="button"
                        onClick={() => setOpen(it)}
                        aria-label={it.alt}
                        className="block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      >
                        <Image src={it.src} alt="" width={0} height={0} sizes="(min-width: 1024px) 400px, 50vw" className="block w-full h-auto" />
                      </button>
                    ) : (
                      <div className="hatch aspect-[3/2]" />
                    )}
                    <figcaption className="absolute left-2.5 right-2.5 bottom-2 xl:bottom-2.5 font-hand text-[19px] xl:text-[21px] leading-none text-ink/80 whitespace-nowrap -rotate-1 origin-left">
                      {it.caption}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          );
        })}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.alt}
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-6"
          onClick={() => setOpen(null)}
        >
          <div className="relative w-full max-w-4xl aspect-[3/2]" onClick={(e) => e.stopPropagation()}>
            <Image src={open.src} alt={open.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-5 text-paper text-[13px] underline underline-offset-4"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
