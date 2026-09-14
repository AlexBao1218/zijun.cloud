"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERY = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

type Props = {
  url: string;
  title: string;
  /** Visible height of the demo box in px. */
  height?: number;
  /** The demo's native layout width in px. When the box is narrower, the iframe renders at this width and is scaled down to fit. */
  width?: number;
  poster?: string;
  activateLabel: string;
  openLabel: string;
  mobileNote: string;
};

export default function DemoFrame({ url, title, height = 720, width, poster, activateLabel, openLabel, mobileNote }: Props) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [active, setActive] = useState(false);
  const [scale, setScale] = useState(1);
  const boxRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Scale the iframe down when the box is narrower than the demo's native width.
  useEffect(() => {
    if (!isDesktop || !width || !boxRef.current) return;
    const el = boxRef.current;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop, width]);

  useEffect(() => {
    if (active) iframeRef.current?.focus();
  }, [active]);

  const style = { "--demo-h": `${height}px` } as React.CSSProperties;

  if (!isDesktop) {
    return (
      <div className="min-w-0 w-full md:h-[var(--demo-h)] md:max-h-[80vh]" style={style}>
        <div className="border border-ink">
          <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
            {poster ? (
              <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover object-top" />
            ) : (
              <div className="hatch absolute inset-0" />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
            <span className="text-ink/70">{mobileNote}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
              {openLabel}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const scaled = width !== undefined && scale < 1;
  const frameStyle: React.CSSProperties = scaled
    ? { width, height: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: "top left" }
    : {};

  return (
    <div className="min-w-0 w-full md:h-[var(--demo-h)] md:max-h-[80vh]" style={style}>
      <div ref={boxRef} className="relative h-full w-full max-w-full border border-ink overflow-hidden">
        <iframe
          ref={iframeRef}
          src={url}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow=""
          referrerPolicy="strict-origin-when-cross-origin"
          inert={!active}
          style={frameStyle}
          className={`block w-full h-full bg-paper ${active ? "" : "pointer-events-none"}`}
        />
        {!active && (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 flex items-end p-4 cursor-pointer"
            aria-label={activateLabel}
          >
            <span className="border border-ink bg-paper px-3 py-1.5 text-[12px] font-medium">{activateLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
