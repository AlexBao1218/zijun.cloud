"use client";

import { useEffect, useRef, useState } from "react";

export type PhotoNote = { strip: number; photo: number; side: "left" | "right" | "below"; text: string };
/** Width of a note's first line in the handwriting face, measured with a throwaway span so the arrow can start right after it. */
function firstLineWidth(host: HTMLElement, text: string) {
  const probe = document.createElement("span");
  probe.className = "font-hand text-[30px]";
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none";
  probe.textContent = text.split("\n")[0];
  host.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return w;
}

/** A note ready to draw: text anchored at (x, y) from the wrapper's left or right edge, and a line from (sx, sy) to the photo edge at (ex, ey). */
type Placed = PhotoNote & { x: number; y: number; w?: number; anchor: "left" | "right"; sx: number; sy: number; ex: number; ey: number };

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
      // phones have no gutter and no room under the band; AboutSection prints the notes as captions there instead
      if (!window.matchMedia("(min-width: 768px)").matches) return setPlaced([]);
      const box = el.getBoundingClientRect();
      const gutter = Math.min(220, Math.floor(box.left) - 12); // the page's own side margin
      setPlaced(
        notes.flatMap((n): Placed[] => {
          const frame = el.querySelector<HTMLElement>(`[data-strip="${n.strip}"][data-photo="${n.photo}"]`);
          if (!frame) return [];
          const r = frame.getBoundingClientRect();
          if (r.width === 0) return []; // the board renders a hidden twin for the other breakpoint
          // the strip scrolls sideways: a note only makes sense while its frame is actually in view
          const scroller = frame.parentElement?.getBoundingClientRect();
          if (scroller && (r.left < scroller.left - 1 || r.right > scroller.right + 1)) return [];
          const strip = frame.closest<HTMLElement>(".bg-ink");
          const sb = (strip ? strip.getBoundingClientRect().bottom : r.bottom) - box.top;
          const left = r.left - box.left, right = r.right - box.left, top = r.top - box.top;
          if (n.side === "below") {
            // note under the band, off to the right; the line runs back almost level to the band edge under the photo
            const ex = left + r.width * 0.5;
            const x = ex + 150, y = sb + 22;
            if (x + 260 > box.width) return [];
            return [{ ...n, x, y, w: 260, anchor: "left" as const, sx: x - 8, sy: y + 15, ex, ey: sb + 8 }];
          }
          if (gutter < 90) return [];
          const ey = top + r.height * 0.42;
          const y = ey - 19;
          const fl = firstLineWidth(el, n.text);
          if (n.side === "left") {
            // text starts at the margin's outer edge; the line leaves the end of the first line and runs level into the photo
            const x = -gutter;
            return [{ ...n, x, y, w: gutter - 14, anchor: "left" as const, sx: x + fl + 10, sy: ey - 2, ex: left - 2, ey }];
          }
          if (fl + 24 <= gutter) {
            // mirror of "left": text ends at the margin's outer edge; the line leaves the start of the first line and runs back into the photo
            const sx = box.width + gutter - fl - 10, ex = right + 2;
            if (sx - ex < 24) return [];
            return [{ ...n, x: -gutter, y, anchor: "right" as const, sx, sy: ey - 2, ex, ey }];
          }
          // the margin is too narrow for the first line: sit under the band instead, off to the left of the photo
          const ex = left + r.width * 0.5, textRight = ex - 150, by = sb + 22;
          if (textRight < 260) return [];
          return [{ ...n, x: box.width - textRight, y: by, anchor: "right" as const, sx: textRight + 8, sy: by + 15, ex, ey: sb + 8 }];
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll<HTMLElement>("[data-strip][data-photo]").forEach((f) => ro.observe(f));
    el.querySelectorAll("img").forEach((img) => img.addEventListener("load", measure, { once: true }));
    const scrollers = new Set<HTMLElement>();
    el.querySelectorAll<HTMLElement>("[data-strip][data-photo]").forEach((f) => f.parentElement && scrollers.add(f.parentElement));
    scrollers.forEach((s) => s.addEventListener("scroll", measure, { passive: true }));
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setVisible(true), { threshold: 0.2 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      scrollers.forEach((s) => s.removeEventListener("scroll", measure));
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
              const sx = n.sx;
              const dir = n.ex >= sx ? 1 : -1; // +1 when the photo is to the right of the text
              const reach = Math.abs(n.ex - sx);
              // both control points sit a little below the lower end, so the line sags like a U (open upward) and never arches
              const sag = Math.max(n.sy, n.ey) + Math.min(16, reach * 0.12);
              const c1x = sx + dir * reach * 0.35, c1y = sag;
              const c2x = n.ex - dir * reach * 0.35, c2y = sag;
              const d = `M${sx} ${n.sy} C${c1x} ${c1y} ${c2x} ${c2y} ${n.ex} ${n.ey}`;
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
          className={`absolute font-hand text-[30px] leading-[1.05] text-ink ${n.anchor === "right" ? "rotate-2 text-right" : "-rotate-2"}`}
          style={{ [n.anchor]: n.x, top: n.y, width: n.w, ["--d" as string]: 0.1 + i * 0.3 }}
        >
          {/* the first line stays whole (the line leaves its end); when the note has a width (gutter, below) the rest wraps to it */}
          {n.text.split("\n").map((line, k) => (
            <span key={k} className={`inline-block ${k === 0 || !n.w ? "whitespace-nowrap" : ""} ${k === 0 ? "" : "text-[24px] leading-[1.15]"} ${n.anchor === "right" ? "ml-auto" : ""}`} style={{ display: "table" }}>
              {line}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
