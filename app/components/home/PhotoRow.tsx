"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string };

export default function PhotoRow({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open === null) return;
    lastTrigger.current = document.activeElement as HTMLElement | null;
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
      <ul className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-7 md:overflow-visible">
        {photos.map((p, i) => (
          <li key={`${p.src}-${i}`} className="shrink-0 w-44 md:w-auto">
            {p.src ? (
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`open photo: ${p.alt}`}
                className="relative block w-full aspect-[4/5] border border-ink overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 14vw, (min-width: 768px) 25vw, 176px" className="object-cover" />
              </button>
            ) : (
              <div className="hatch block w-full aspect-[4/5] border border-ink" />
            )}
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-6"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-[3/2]"
            onClick={(e) => e.stopPropagation()}
          >
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
