"use client";

import { useEffect, useRef, useState } from "react";

export type PhotoNote = { strip: number; photo: number; side: "left" | "right"; text: string };
type Placed = PhotoNote & { x: number; y: number; tx: number; ty: number; cx: number; cy: number };

const GUTTER = 240; // px of margin on each side where notes live (xl and up)

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
      if (box.width < 1100) return setPlaced([]);
      setPlaced(
        notes.flatMap((n) => {
          const frame = el.querySelector<HTMLElement>(`[data-strip="${n.strip}"][data-photo="${n.photo}"]`);
          if (!frame) return [];
          const r = frame.getBoundingClientRect();
          const tx = n.side === "left" ? r.left - box.left : r.right - box.left; // arrow tip on the frame edge
          const ty = r.top - box.top + r.height * 0.45;
          const x = n.side === "left" ? 16 : box.width - 16; // note anchor
          const y = ty - 56 - (n.strip % 2) * 24;
          const cx = n.side === "left" ? (x + tx) / 2 - 30 : (x + tx) / 2 + 30; // bend the arrow
          const cy = y + 40;
          return [{ ...n, x, y, tx, ty, cx, cy }];
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
    <div ref={ref} className="relative xl:px-[240px] sketch" data-visible={visible} style={{ ["--gutter" as string]: `${GUTTER}px` }}>
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
              const sx = n.side === "left" ? n.x + 8 : n.x - 8;
              const sy = n.y + 18;
              const dir = n.side === "left" ? -1 : 1; // arrowhead points into the frame
              return (
                <g key={i}>
                  <path d={`M${sx} ${sy} Q${n.cx} ${n.cy} ${n.tx + dir * 6} ${n.ty}`} data-draw style={{ ["--d" as string]: 0.2 + i * 0.35 }} />
                  <path d={`M${n.tx + dir * 6 - dir * -9} ${n.ty - 7} L${n.tx + dir * 6} ${n.ty} L${n.tx + dir * 6 - dir * -9} ${n.ty + 5}`} data-draw style={{ ["--d" as string]: 0.9 + i * 0.35 }} />
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
          className="absolute max-w-[215px] font-hand text-[28px] leading-[1.05] text-ink -rotate-3"
          style={{
            left: n.side === "left" ? n.x : undefined,
            right: n.side === "right" ? 16 : undefined,
            textAlign: n.side === "right" ? "right" : "left",
            top: n.y - 12,
            ["--d" as string]: 0.1 + i * 0.35,
          }}
        >
          {n.text}
        </span>
      ))}
    </div>
  );
}
