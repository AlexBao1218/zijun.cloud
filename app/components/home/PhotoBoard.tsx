"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string };
export type PhotoBlock = { name: string; title: string; text: string; photos: Photo[] };

/**
 * Four hobbies in one row, each its own short filmstrip with a serif title above and a one-line note below. Frames keep
 * their native shape: a block with several photos stacks landscapes, a block with one holds a portrait. The portrait
 * blocks set the row height; a stacked block's band stretches to it, and 9:8 columns make its frames land at 3:2.
 */
const COLS = "lg:grid-cols-[9fr_8fr_8fr_8fr]";

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

  return (
    <>
      <div className={`grid gap-12 lg:gap-10 xl:gap-12 ${COLS} lg:max-w-[1180px] lg:mx-auto`}>
        {blocks.map((b, s) => {
          const stacked = b.photos.length > 1;
          return (
            <article key={b.name} className="grid grid-rows-[auto_1fr_auto] gap-4">
              <h3 className="font-serif text-2xl xl:text-3xl leading-none">{b.title}</h3>
              <div className="bg-ink py-1.5 -mx-6 md:mx-0 flex flex-col">
                <div className="sprockets" aria-hidden="true" />
                <div className="flex-1 flex flex-col gap-1 px-1 py-1">
                  {b.photos.map((p, i) => (
                    <div
                      key={`${p.src}-${i}`}
                      className={`relative ${stacked ? "aspect-[3/2] lg:aspect-auto lg:flex-1 lg:min-h-0" : "aspect-[3/4] lg:aspect-[2/3]"}`}
                      data-strip={s}
                      data-photo={i}
                    >
                      {p.src ? (
                        <button
                          type="button"
                          onClick={() => setOpen(p)}
                          aria-label={p.alt}
                          className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-paper"
                        >
                          <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" />
                        </button>
                      ) : (
                        <div className="hatch absolute inset-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="sprockets" aria-hidden="true" />
              </div>
              {/* two lines tall whatever the note says, so every band in the row ends on the same edge */}
              <p className="min-h-[2lh] text-[13px] xl:text-[14px] leading-relaxed text-ink/70">{b.text}</p>
            </article>
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
