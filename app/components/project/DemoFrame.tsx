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
  height?: number;
  poster?: string;
  activateLabel: string;
  openLabel: string;
  mobileNote: string;
};

export default function DemoFrame({ url, title, height = 720, poster, activateLabel, openLabel, mobileNote }: Props) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [active, setActive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // `inert` keeps the frame unfocusable until activated, so focus has to wait
  // for the commit that removes it.
  useEffect(() => {
    if (active) iframeRef.current?.focus();
  }, [active]);

  return (
    <div
      className="md:h-[var(--demo-h)] md:max-h-[80vh]"
      style={{ "--demo-h": `${height}px` } as React.CSSProperties}
    >
      {isDesktop ? (
        <div className="relative h-full border border-ink">
          <iframe
            ref={iframeRef}
            src={url}
            title={title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow=""
            referrerPolicy="strict-origin-when-cross-origin"
            inert={!active}
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
      ) : (
        <div className="border border-ink">
          <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
            {poster ? <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
            <span className="text-ink/70">{mobileNote}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
              {openLabel}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
