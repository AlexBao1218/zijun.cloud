"use client";

import { useEffect, useRef, useState } from "react";
import { firstLineWidth, head, levelPath, upPath } from "./hand";

type Placed = { nx: number; ny: number; w?: number; line: string; head: string };

/**
 * Handwritten "click to open" beside the first row of work cards, the same idiom as the photo notes:
 * in the page gutter when there is room (the line leaves the end of the first line and runs level into the first card),
 * otherwise tucked under the first card with the line hooking up into its bottom edge. Nothing on phones.
 * Positions are measured from the DOM (data-work-card on each item) and re-measured on resize and font load.
 */
export default function WorkHint({ text, children }: { text: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const target = el.querySelector<HTMLElement>("[data-work-card]");
      if (!target || !window.matchMedia("(min-width: 768px)").matches) return setPlaced(null);
      const box = el.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const left = r.left - box.left, top = r.top - box.top, bottom = r.bottom - box.top;
      const gutter = Math.min(220, Math.floor(box.left) - 12); // the page's own side margin
      const fl = firstLineWidth(el, text);
      if (gutter >= fl + 40) {
        // text starts at the margin's outer edge; the line leaves the end of the first line and runs level into the card (at least ~28px of it)
        const ey = top + r.height * 0.42;
        const nx = -gutter, ny = ey - 19;
        return setPlaced({ nx, ny, w: gutter - 14, line: levelPath(nx + fl + 10, ey - 2, left - 2, ey), head: head(left - 2, ey, "right") });
      }
      // under the card, only when no other card sits below it (the row wraps between md and lg)
      if (box.bottom - r.bottom > 40) return setPlaced(null);
      const nx = left, ny = bottom + 14;
      const sx = nx + fl + 12, sy = ny + 15, ex = sx + 44, ey = bottom + 2;
      setPlaced({ nx, ny, line: upPath(sx, sy, ex, ey), head: head(ex, ey, "up") });
    };
    measure();
    document.fonts.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  return (
    <div ref={ref} className="relative sketch" data-visible={visible}>
      {children}
      {placed && (
        <>
          <svg className="max-md:hidden pointer-events-none absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
            <defs>
              <filter id="wob-hint" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <g filter="url(#wob-hint)" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={placed.line} data-draw style={{ ["--d" as string]: 0.3 }} />
              <path d={placed.head} data-draw style={{ ["--d" as string]: 0.9 }} />
            </g>
          </svg>
          <span
            data-fade
            className="max-md:hidden absolute font-hand text-[30px] leading-[1.05] text-ink -rotate-2"
            style={{ left: placed.nx, top: placed.ny, width: placed.w, ["--d" as string]: 0.1 }}
          >
            {/* first line stays on one line (the arrow leaves its end); in the gutter the rest wraps to the margin's width */}
            {text.split("\n").map((line, k) => (
              <span key={k} className={`inline-block ${k === 0 ? "whitespace-nowrap" : `text-[24px] leading-[1.15] ${placed.w ? "" : "whitespace-nowrap"}`}`} style={{ display: "table" }}>
                {line}
              </span>
            ))}
          </span>
        </>
      )}
    </div>
  );
}
