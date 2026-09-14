"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

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

  if (!isDesktop) {
    return (
      <div className="border border-ink">
        <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
          {poster ? <Image src={poster} alt="" fill sizes="100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <span className="text-ink/70">{mobileNote}</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
            {openLabel}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-ink" style={{ height }}>
      <iframe
        src={url}
        title={title}
        loading="lazy"
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
  );
}
