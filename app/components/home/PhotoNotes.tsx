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
        notes.flatMap((n) => {
          const frame = el.querySelector<HTMLElement>(`[data-strip="${n.strip}"][data-photo="${n.photo}"]`);
          if (!frame) return [];
          const r = frame.getBoundingClientRect();
          const strip = frame.closest<HTMLElement>(".bg-ink");
          const sb = (strip ? strip.getBoundingClientRect().bottom : r.bottom) - box.top;
          const left = r.left - box.left, right = r.right - box.left, top = r.top - box.top, bottom = r.bottom - box.top;
          if (n.side === "below") {
            // note under the band, a little right of the photo's centre; line goes straight up into the photo's bottom edge
            // the film border is ink, so the line stops at the band's bottom edge right under the photo
            const ex = left + r.width * 0.55, ey = sb + 3;
            const nx = ex + 30, ny = sb + 30;
            return [{ ...n, nx, ny, w: 220, sx: nx - 4, sy: ny + 6, ex, ey, align: "left" as const }];
          }
          if (gutter < 90) return [];
          const ey = top + r.height * 0.42;
          if (n.side === "left") {
            const nx = -gutter, ny = ey - 58;
            return [{ ...n, nx, ny, w: gutter - 14, sx: -12, sy: ny + 22, ex: left - 2, ey, align: "left" as const }];
          }
          const nx = box.width + 12, ny = ey - 58;
          return [{ ...n, nx, ny, w: gutter - 14, sx: box.width + 12, sy: ny + 22, ex: right + 2, ey, align: "left" as const }];
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
              // one gentle arc: control point sits a little off the straight line, bowed away from the strip
              const mx = (n.sx + n.ex) / 2, my = (n.sy + n.ey) / 2;
              const dx = n.ex - n.sx, dy = n.ey - n.sy;
              const len = Math.hypot(dx, dy) || 1;
              const bow = Math.min(18, len * 0.18);
              const cx = mx - (dy / len) * bow, cy = my + (dx / len) * bow;
              // arrowhead along the incoming tangent (from the control point)
              const a = Math.atan2(n.ey - cy, n.ex - cx);
              const hx = (t: number) => n.ex - 8 * Math.cos(a - t), hy = (t: number) => n.ey - 8 * Math.sin(a - t);
              return (
                <g key={i}>
                  <path d={`M${n.sx} ${n.sy} Q${cx} ${cy} ${n.ex} ${n.ey}`} data-draw style={{ ["--d" as string]: 0.2 + i * 0.3 }} />
                  <path d={`M${hx(0.55)} ${hy(0.55)} L${n.ex} ${n.ey} L${hx(-0.55)} ${hy(-0.55)}`} data-draw style={{ ["--d" as string]: 0.8 + i * 0.3 }} />
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
          className="absolute font-hand text-[26px] leading-[1.05] text-ink -rotate-3"
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
