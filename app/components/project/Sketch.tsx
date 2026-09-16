"use client";

import { useEffect, useRef, useState } from "react";

/** Wraps an inline SVG sketch and flips data-visible when it scrolls into view, which starts the draw-on animation (see globals.css). */
export default function Sketch({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-visible={visible} role="img" aria-label={label} className="sketch border border-ink bg-paper px-4 py-5 md:px-6 md:py-6 overflow-x-auto [scrollbar-width:thin]">
      {children}
    </div>
  );
}
