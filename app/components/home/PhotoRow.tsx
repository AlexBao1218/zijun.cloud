"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string };

/** Contact-sheet filmstrip: an ink band with sprocket holes, frames at a fixed height that keep their own aspect ratio, horizontal scroll with snap. Click a frame to enlarge. */
export default function PhotoRow({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open === null) return;
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

  const current = open !== null ? photos[open] : null;

  return (
    <>
      <div className="bg-ink py-1.5 -mx-6 md:mx-0">
        <div className="sprockets" aria-hidden="true" />
        <ul className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-3 py-2 [scrollbar-width:thin]">
          {photos.map((p, i) => (
            <li key={`${p.src}-${i}`} className="shrink-0 snap-start w-fit">
              {p.src ? (
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`open photo: ${p.alt}`}
                  className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={0}
                    height={0}
                    sizes="(min-width: 768px) 420px, 300px"
                    className="block h-[220px] md:h-[280px] w-auto border border-paper"
                  />
                </button>
              ) : (
                <div className="hatch h-[220px] md:h-[280px] w-[176px] border border-paper" />
              )}
            </li>
          ))}
        </ul>
        <div className="sprockets" aria-hidden="true" />
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-6"
          onClick={() => setOpen(null)}
        >
          <div className="relative w-full max-w-4xl aspect-[3/2]" onClick={(e) => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-5 text-paper text-[13px] underline underline-offset-4"
          >
            close
          </button>
        </div>
      )}
    </>
  );
}
