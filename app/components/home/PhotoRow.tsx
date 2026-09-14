"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { src: string; alt: string };

export default function PhotoRow({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = open !== null ? photos[open] : null;

  return (
    <>
      <ul className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-6 md:overflow-visible">
        {photos.map((p, i) => (
          <li key={`${p.src}-${i}`} className="shrink-0 w-36 md:w-auto">
            <button
              type="button"
              onClick={() => p.src && setOpen(i)}
              disabled={!p.src}
              aria-label={p.alt}
              className="relative block w-full aspect-[4/5] border border-ink overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-default"
            >
              {p.src ? (
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 16vw, 144px" className="object-cover" />
              ) : (
                <span className="hatch absolute inset-0" />
              )}
            </button>
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
          <div className="relative w-full max-w-4xl aspect-[3/2]">
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
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
