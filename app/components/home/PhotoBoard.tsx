"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string };
export type PhotoBlock = { name: string; title: string; text: string; wide?: boolean; photos: Photo[] };

/** Board columns: the wide block takes three units, each narrow block two — an 18-column, 6-row sheet from lg. */
const COLS = "lg:grid-cols-[3fr_2fr_2fr_2fr]";

/**
 * Frame shapes. From lg every block is 6 rows tall so the columns tile the sheet exactly; under lg each frame keeps a
 * fixed aspect instead and the blocks stack.
 */
const CELL = {
  big: "col-span-2 aspect-[3/2] lg:aspect-auto lg:col-span-2 lg:row-span-4",
  small: "aspect-[3/2] lg:aspect-auto lg:row-span-2",
  portrait: "col-span-2 aspect-[4/3] lg:aspect-auto lg:row-span-6",
  square: "aspect-square lg:aspect-auto lg:col-span-2 lg:row-span-4",
  wide: "aspect-[2/1] lg:aspect-auto lg:col-span-2 lg:row-span-2",
} as const;

/** Which frames a block gets, by shape: wide → big over two small; two photos → square over wide; one → portrait. */
function shapes(b: PhotoBlock): (keyof typeof CELL)[] {
  if (b.wide) return ["big", "small", "small"];
  if (b.photos.length === 2) return ["square", "wide"];
  return ["portrait"];
}

/** One contact sheet for every hobby: an ink band with sprocket holes, blocks side by side, titles above and notes below in the same columns. Click a frame to enlarge. */
export default function PhotoBoard({ blocks }: { blocks: PhotoBlock[] }) {
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

  const frames = (b: PhotoBlock, strip: number) => {
    const sh = shapes(b);
    return b.photos.map((p, i) => (
      <div key={`${p.src}-${i}`} className={`relative ${CELL[sh[i]]}`} data-strip={strip} data-photo={i}>
        {p.src ? (
          <button
            type="button"
            onClick={() => setOpen(p)}
            aria-label={p.alt}
            className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-paper"
          >
            <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
          </button>
        ) : (
          <div className="hatch absolute inset-0" />
        )}
      </div>
    ));
  };

  return (
    <>
      {/* desktop: titles / sheet / notes share one column grid */}
      <div className="hidden lg:grid gap-4">
        <div className={`grid ${COLS} gap-x-6 items-baseline`}>
          {blocks.map((b) => (
            <h3 key={b.name} className="font-serif text-2xl xl:text-3xl leading-none">{b.title}</h3>
          ))}
        </div>
        <div className="bg-ink py-1.5">
          <div className="sprockets" aria-hidden="true" />
          {/* 3+2+2+2 units wide, 3 units tall — the frames inside tile that height, the sheet is what sets it */}
          <div className={`grid ${COLS} gap-1 px-1 py-2 aspect-[3/1]`}>
            {blocks.map((b, s) => (
              <div key={b.name} className="grid grid-cols-2 grid-rows-6 gap-1">{frames(b, s)}</div>
            ))}
          </div>
          <div className="sprockets" aria-hidden="true" />
        </div>
        <div className={`grid ${COLS} gap-x-6`}>
          {blocks.map((b) => (
            <p key={b.name} className="text-[13px] xl:text-[14px] leading-relaxed text-ink/80">{b.text}</p>
          ))}
        </div>
      </div>

      {/* phones and tablets: one block after another, each its own short strip */}
      <div className="lg:hidden grid gap-12">
        {blocks.map((b, s) => (
          <article key={b.name} className="grid gap-4">
            <h3 className="font-serif text-2xl leading-none">{b.title}</h3>
            <div className="bg-ink py-1.5 -mx-6 md:mx-0">
              <div className="sprockets" aria-hidden="true" />
              <div className="grid grid-cols-2 gap-1 px-1 py-2">{frames(b, s)}</div>
              <div className="sprockets" aria-hidden="true" />
            </div>
            <p className="text-[14px] leading-relaxed text-ink/80">{b.text}</p>
          </article>
        ))}
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
