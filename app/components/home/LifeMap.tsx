import Sketch from "@/app/components/project/Sketch";
import { Wobble, mono, stroke } from "@/app/components/project/sketches/common";
import { CHINA_H, CHINA_PATHS, CHINA_W } from "@/lib/china-outline";

type Stop = { name: string; stage: string; lon: number; lat: number };
type Props = { title: string; lede: string; stops: Stop[]; aside: string };

const P = 16;
const project = (lon: number, lat: number) =>
  [((lon - 73) / (136 - 73)) * (CHINA_W - 2 * P) + P, ((54 - lat) / (54 - 17)) * (CHINA_H - 2 * P) + P] as const;

/** Map of China (real outline, drawn in ink) with the places Alex has lived joined in order; the story sits beside it. */
export default function LifeMap({ title, lede, stops, aside }: Props) {
  const pts = stops.map((s) => project(s.lon, s.lat));
  const route = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_300px] gap-10 md:gap-14 items-center">
      <Sketch label={`${title}: ${stops.map((s) => `${s.stage} in ${s.name}`).join(", ")}`}>
        <svg viewBox={`0 0 ${CHINA_W} ${CHINA_H}`} width="100%" style={{ minWidth: 520 }} filter="url(#wob-map)">
          <defs><Wobble id="wob-map" /></defs>
          {CHINA_PATHS.map((d, i) => (
            <path key={i} d={d} {...stroke} strokeWidth={1.2} data-draw style={{ ["--d" as string]: i * 0.3, strokeDasharray: 8000, strokeDashoffset: 8000 }} />
          ))}
          <path d={route} {...stroke} stroke="var(--pop)" strokeWidth={1.8} data-draw style={{ ["--d" as string]: 1.2 }} />
          {stops.map((s, i) => {
            const [x, y] = pts[i];
            const right = s.lon > 112;
            const dy = s.name === "hong kong" ? 14 : 4;
            return (
              <g key={s.name}>
                <circle cx={x} cy={y} r={4.5} fill="var(--pop)" stroke="var(--paper)" strokeWidth={2} data-fade style={{ ["--d" as string]: 1.4 + i * 0.3 }} />
                <text x={right ? x + 11 : x - 11} y={y + dy} textAnchor={right ? "start" : "end"} style={mono} data-fade>{s.name}</text>
              </g>
            );
          })}
        </svg>
      </Sketch>
      <div className="grid gap-7">
        <p className="font-serif italic text-[20px] md:text-[22px] leading-snug">{lede}</p>
        <ol className="grid border-t border-ink">
          {stops.map((s, i) => (
            <li key={s.name} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-ink py-2.5 text-[13px]">
              <span className="text-[10px] tracking-[0.14em] text-ink/50">{String(i + 1).padStart(2, "0")}</span>
              <span>{s.name}</span>
              <span className="text-ink/60 text-right">{s.stage}</span>
            </li>
          ))}
        </ol>
        <p className="text-[13px] leading-relaxed">{aside}</p>
      </div>
    </div>
  );
}
