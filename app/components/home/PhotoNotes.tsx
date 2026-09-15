"use client";

import { useEffect, useRef, useState } from "react";

export type PhotoNote = { strip: number; photo: number; side: "left" | "right" | "below"; text: string };
type Placed = PhotoNote & { nx: number; ny: number; w: number; sx: number; sy: number; ex: number; ey: number; align: "left" | "right" };

/**
 * Handwritten notes beside the photo strips, the way a person annotates a contact sheet:
 * the note sits in the nearest empty space (page margin, or just under the band) and one short, gently curved line runs to the photo's edge.
 * Positions are measured from the DOM (data-strip / data-photo on each frame) and re-measured on resize and image load.
 */
export default function PhotoNotes({ notes, children }: { notes: PhotoNote[]; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const gutter = Math.min(220, Math.floor(box.left) - 12); // the page's own side margin
      setPlaced(
        notes.flatMap((n): Placed[] => {
          const frame = el.querySelector<HTMLElement>(`[data-strip="${n.strip}"][data-photo="${n.photo}"]`);
          if (!frame) return [];
          const r = frame.getBoundingClientRect();
          const strip = frame.closest<HTMLElement>(".bg-ink");
          const sb = (strip ? strip.getBoundingClientRect().bottom : r.bottom) - box.top;
          const left = r.left - box.left, right = r.right - box.left, top = r.top - box.top;
          if (n.side === "below") {
            // note under the band, off to the right; the line runs back almost level to the band edge under the photo
            const ex = left + r.width * 0.5;
            const nx = ex + 150, ny = sb + 22;
            return [{ ...n, nx, ny, w: 220, sx: nx - 8, sy: ny + 12, ex, ey: sb + 8, align: "left" as const }];
          }
          if (gutter < 90) return [];
          const ey = top + r.height * 0.42;
          const w = Math.round(gutter * 0.58);
          if (n.side === "left") {
            // text ends where the line starts; the line runs level into the photo's left edge
            const nx = -gutter, ny = ey - 16;
            return [{ ...n, nx, ny, w, sx: nx + w + 8, sy: ey - 2, ex: left - 2, ey, align: "right" as const }];
          }
          const nx = box.width + gutter - w, ny = ey - 16;
          return [{ ...n, nx, ny, w, sx: nx - 8, sy: ey - 2, ex: right + 2, ey, align: "left" as const }];
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll<HTMLElement>("[data-strip][data-photo]").forEach((f) => ro.observe(f));
    el.querySelectorAll("img").forEach((img) => img.addEventListener("load", measure, { once: true }));
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [notes]);

  return (
    <div ref={ref} className="relative sketch" data-visible={visible}>
      {children}
      {placed.length > 0 && (
        <svg className="pointer-events-none absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
          <defs>
            <filter id="wob-notes" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#wob-notes)" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {placed.map((n, i) => {
              // a level line: leaves the text horizontally and arrives at the photo horizontally, with only a slight sag between
              const dir = n.ex >= n.sx ? 1 : -1; // +1 when the photo is to the right of the text
              const reach = Math.abs(n.ex - n.sx);
              const c1x = n.sx + dir * reach * 0.35, c1y = n.sy + 6;
              const c2x = n.ex - dir * reach * 0.35, c2y = n.ey;
              const d = `M${n.sx} ${n.sy} C${c1x} ${c1y} ${c2x} ${c2y} ${n.ex} ${n.ey}`;
              const hx = n.ex - dir * 9; // horizontal arrowhead
              return (
                <g key={i}>
                  <path d={d} data-draw style={{ ["--d" as string]: 0.2 + i * 0.3 }} />
                  <path d={`M${hx} ${n.ey - 5} L${n.ex} ${n.ey} L${hx} ${n.ey + 5}`} data-draw style={{ ["--d" as string]: 0.8 + i * 0.3 }} />
                </g>
              );
            })}
          </g>
        </svg>
      )}
      {placed.map((n, i) => (
        <span
          key={i}
          data-fade
          className="absolute font-hand text-[24px] leading-[1.05] text-ink -rotate-2"
          style={{ left: n.nx, top: n.ny, width: n.w, textAlign: n.align, ["--d" as string]: 0.1 + i * 0.3 }}
        >
          {n.text.split("\n").map((line, k) => (
            <span key={k} className="block">{line}</span>
          ))}
        </span>
      ))}
    </div>
  );
}
