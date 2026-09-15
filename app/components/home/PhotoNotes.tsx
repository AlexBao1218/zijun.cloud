"use client";

import { useEffect, useRef, useState } from "react";

export type PhotoNote = { strip: number; photo: number; side: "left" | "right"; text: string; /** "under": loop below the note and arrive at the frame from beneath */ curve?: "under" };
type Placed = PhotoNote & { x: number; y: number; tx: number; ty: number; cx: number; cy: number; gutter: number; sb: number };


/**
 * Handwritten notes in the gutters beside the photo strips, each with a hand-drawn arrow curving to its photo.
 * Positions are measured from the strips' DOM (data-strip / data-photo on each frame) and re-measured on resize.
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
      // notes live in the page's own side margin, outside the strips; need ~90px to be legible
      const gutter = Math.min(220, Math.floor(box.left) - 12);
      if (gutter < 90) return setPlaced([]);
      setPlaced(
        notes.flatMap((n) => {
          const frame = el.querySelector<HTMLElement>(`[data-strip="${n.strip}"][data-photo="${n.photo}"]`);
          if (!frame) return [];
          const r = frame.getBoundingClientRect();
          const strip = frame.closest<HTMLElement>(".bg-ink");
          const sb = strip ? strip.getBoundingClientRect().bottom - box.top : r.bottom - box.top; // bottom of the film band
          const tx = n.side === "left" ? r.left - box.left : r.right - box.left; // arrow tip on the frame edge
          const ty = r.top - box.top + r.height * 0.45;
          const x = n.side === "left" ? -gutter : box.width + gutter; // outer edge of the note
          const y = ty - 70 - (n.strip % 2) * 20;
          const cx = n.side === "left" ? tx - gutter * 0.35 : tx + gutter * 0.35; // bend the arrow
          const cy = y + 50;
          return [{ ...n, x, y, tx, ty, cx, cy, gutter, sb }];
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // frames change width as their images load (height fixed, width auto), so watch each target too
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
              <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <g filter="url(#wob-notes)" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {placed.map((n, i) => {
              const dir = n.side === "left" ? -1 : 1; // +1 when the frame edge is to the LEFT of the note
              const sx = n.side === "left" ? n.x + n.gutter - 10 : n.x - n.gutter + 10; // inner edge of the note
              const ex = n.tx + dir * 6; // arrow tip just outside the frame edge
              // the arrow always ENTERS the frame horizontally: the last control point sits level with the tip
              const c2x = ex + dir * Math.max(60, n.gutter * 0.5), c2y = n.ty;
              let d: string;
              if (n.curve === "under") {
                // leave the note downwards, run beneath the film band, come up through the gap beside the frame and hook into its edge
                const sy = n.y + 44;
                const under = n.sb + 28;
                const gapX = ex + dir * 10;
                d = `M${sx + dir * 30} ${sy} C${sx + dir * 30} ${under} ${gapX + dir * 120} ${under} ${gapX} ${under} S${gapX} ${n.ty + 40} ${ex} ${n.ty}`;
              } else {
                // leave the note level, dip a little, come in level
                const sy = n.y + 22;
                d = `M${sx} ${sy} C${sx - dir * n.gutter * 0.35} ${sy + 10} ${c2x} ${c2y} ${ex} ${n.ty}`;
              }
              const hx = ex + dir * 9;
              return (
                <g key={i}>
                  <path d={d} data-draw style={{ ["--d" as string]: 0.2 + i * 0.35 }} />
                  <path d={`M${hx} ${n.ty - 6} L${ex} ${n.ty} L${hx} ${n.ty + 6}`} data-draw style={{ ["--d" as string]: 0.9 + i * 0.35 }} />
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
          style={{
            left: n.side === "left" ? n.x : undefined,
            right: n.side === "right" ? -n.gutter : undefined,
            width: n.gutter - 14,
            textAlign: n.side === "right" ? "right" : "left",
            top: n.y - 12,
            ["--d" as string]: 0.1 + i * 0.35,
          }}
        >
          {n.text.split("\n").map((line, k) => (
            <span key={k} className="block">{line}</span>
          ))}
        </span>
      ))}
    </div>
  );
}
