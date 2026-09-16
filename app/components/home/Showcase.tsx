"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import WorkCard from "./WorkCard";
import type { WorkCardData, WorkGroup } from "@/lib/projects";

type Item = { group: WorkGroup; card: WorkCardData };

// Card width and spacing on the stage come from --card / --step declared on .work-scope (globals.css)
const arrowClass =
  "size-11 border border-ink bg-paper flex items-center justify-center text-[18px] leading-none hover:bg-fill focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/** Record-picker showcase: the active card sits in the middle at full size, its neighbours sit behind it smaller and dimmed; a brief panel describes the active one. */
export default function Showcase({ items, openLabel }: { items: Item[]; openLabel: string }) {
  const [active, setActive] = useState(0);
  const n = items.length;
  const go = useCallback((delta: number) => setActive((a) => (a + delta + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const current = items[active];

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_var(--card)] gap-12 lg:gap-x-[var(--gap)] items-center">
      {/* stage */}
      <div className="grid gap-8 justify-items-center">
        <div className="relative w-full max-w-[calc(2*var(--card)+var(--gap))] h-[max(420px,calc(var(--card)*1.35))] overflow-hidden">
          {items.map((it, i) => {
            let off = i - active;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            const isActive = off === 0;
            return (
              <div
                key={it.card.slug}
                aria-hidden={!isActive}
                onClick={() => !isActive && setActive(i)}
                className={`absolute left-1/2 top-4 w-[var(--card)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${isActive ? "cursor-default" : "cursor-pointer"}`}
                style={{
                  transform: `translateX(calc(-50% + ${off} * var(--step))) scale(${isActive ? 1 : 0.8})`,
                  opacity: isActive ? 1 : Math.abs(off) === 1 ? 0.45 : 0,
                  zIndex: 10 - Math.abs(off),
                  pointerEvents: Math.abs(off) > 1 ? "none" : "auto",
                }}
              >
                <div className={isActive ? "" : "pointer-events-none"}>
                  <WorkCard card={it.card} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => go(-1)} aria-label="previous project" className={arrowClass}>←</button>
          <ol className="flex gap-2" aria-hidden="true">
            {items.map((it, i) => (
              <li key={it.card.slug} className={`size-2 border border-ink ${i === active ? "bg-ink" : "bg-paper"}`} />
            ))}
          </ol>
          <button type="button" onClick={() => go(1)} aria-label="next project" className={arrowClass}>→</button>
        </div>
      </div>

      {/* brief */}
      <aside className="grid gap-4 border-t lg:border-t-0 lg:border-l border-ink pt-6 lg:pt-0 lg:pl-8" aria-live="polite">
        <h3 className="font-serif text-3xl xl:text-4xl leading-none">{current.card.title}</h3>
        <p className="text-[13px] xl:text-[15px] leading-relaxed">{current.card.brief}</p>
        <Link href={`/projects/${current.card.slug}`} className="text-[13px] underline decoration-1 underline-offset-4 hover:decoration-2 justify-self-start">
          {openLabel}
        </Link>
      </aside>
    </div>
  );
}
