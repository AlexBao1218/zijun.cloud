import Sketch from "@/app/components/project/Sketch";
import { Wobble, stroke } from "@/app/components/project/sketches/common";
import { CHINA_H, CHINA_PATHS, CHINA_W } from "@/lib/china-outline";

type Stop = { name: string; stage: string; lon: number; lat: number };
type Props = { title: string; lede: string; text: string; stops: Stop[] };
type Pt = readonly [number, number];

const P = 16;
const TRAVEL_S = 3.6; // seconds for the whole journey
const project = (lon: number, lat: number): Pt =>
  [((lon - 73) / (136 - 73)) * (CHINA_W - 2 * P) + P, ((54 - lat) / (54 - 17)) * (CHINA_H - 2 * P) + P];

/** Catmull-Rom through the stops, emitted as cubic Béziers so the same string works for the SVG path and CSS offset-path. */
function splinePath(pts: Pt[]) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Approximate length of each segment by sampling the same spline, so pins can drop when the marker arrives. */
function segmentLengths(pts: Pt[], perSeg = 60) {
  const lens: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    let len = 0, prev: Pt = p1;
    for (let k = 1; k <= perSeg; k++) {
      const t = k / perSeg, t2 = t * t, t3 = t2 * t;
      const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      len += Math.hypot(x - prev[0], y - prev[1]);
      prev = [x, y];
    }
    lens.push(len);
  }
  return lens;
}

/** Map of China (real outline) with the journey drawn as a route: the line draws itself, a marker travels it, and a pin drops at each city as the marker arrives. */
export default function LifeMap({ title, lede, text, stops }: Props) {
  const pts = stops.map((s) => project(s.lon, s.lat));
  const d = splinePath(pts);
  const lens = segmentLengths(pts);
  const total = lens.reduce((a, b) => a + b, 0);
  const arrivals = lens.reduce<number[]>((acc, l) => [...acc, acc[acc.length - 1] + l], [0]).map((v) => (v / total) * TRAVEL_S);

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_460px] gap-10 lg:gap-14 xl:gap-24 items-center">
      <Sketch label={`${title}: ${stops.map((s) => `${s.stage} in ${s.name}`).join(", ")}`}>
        <div className="relative">
          <svg viewBox={`0 0 ${CHINA_W} ${CHINA_H}`} width="100%" className="block overflow-visible">
            <defs><Wobble id="wob-map" /></defs>
            <g filter="url(#wob-map)">
              {CHINA_PATHS.map((p, i) => (
                <path key={i} d={p} {...stroke} strokeWidth={1.2} data-draw style={{ ["--d" as string]: i * 0.25, strokeDasharray: 8000, strokeDashoffset: 8000 }} />
              ))}
            </g>
            {/* the route draws itself under the marker */}
            <path d={d} {...stroke} stroke="var(--pop)" strokeWidth={1.6} className="travel-route" style={{ strokeDasharray: total, strokeDashoffset: total, ["--len" as string]: total, ["--travel" as string]: `${TRAVEL_S}s` }} />
            {/* pins drop in as the marker arrives */}
            {stops.map((s, i) => {
              const [x, y] = pts[i];
              const last = i === stops.length - 1;
              return (
                <g key={s.name} className="travel-pin" style={{ ["--at" as string]: `${arrivals[i].toFixed(2)}s`, transformOrigin: `${x}px ${y}px` }}>
                  {last && <circle cx={x} cy={y} r={5} className="travel-pulse" fill="none" stroke="var(--pop)" strokeWidth={1.5} style={{ ["--at" as string]: `${(arrivals[i] + 0.3).toFixed(2)}s`, transformOrigin: `${x}px ${y}px` }} />}
                  <path d={`M${x} ${y} c-6 -7 -7 -9 -7 -13 a7 7 0 0 1 14 0 c0 4 -1 6 -7 13z`} fill={last ? "var(--pop)" : "var(--ink)"} stroke="var(--paper)" strokeWidth={1.5} />
                  <circle cx={x} cy={y - 13} r={2.4} fill="var(--paper)" />
                </g>
              );
            })}
            {/* the traveller */}
            <g className="travel-marker" style={{ offsetPath: `path("${d}")`, ["--travel" as string]: `${TRAVEL_S}s` }}>
              <circle r={5.5} fill="var(--paper)" stroke="var(--pop)" strokeWidth={2} />
              <circle r={2} fill="var(--pop)" />
            </g>
          </svg>
          {/* city labels live in HTML so they keep a readable size while the map scales; each drops in with its pin */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {stops.map((s, i) => {
              const [x, y] = pts[i];
              const right = s.lon > 112; // label sits to the right of the pin (west-anchored) or to the left of it
              const edge = (x + 12) / CHINA_W;
              return (
                <div
                  key={s.name}
                  className={`travel-pin absolute -mt-[6px] font-mono text-[11px] sm:text-[12px] leading-none ${right ? "text-left" : "text-right"}`}
                  style={{
                    top: `${(y / CHINA_H) * 100}%`,
                    ...(right ? { left: `${edge * 100}%`, maxWidth: `${(1 - edge) * 100}%` } : { right: `${(1 - (x - 12) / CHINA_W) * 100}%` }),
                    ["--at" as string]: `${arrivals[i].toFixed(2)}s`,
                  }}
                >
                  <span className="block whitespace-nowrap">{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Sketch>
      <div className="grid gap-5 xl:gap-6">
        <h3 className="font-serif text-3xl xl:text-4xl leading-none">{title}</h3>
        <p className="font-serif italic text-[20px] md:text-[22px] xl:text-[26px] leading-snug">{lede}</p>
        <ol className="text-[13px] xl:text-[15px] border-t border-ink/20">
          {stops.map((s) => (
            <li key={s.name} className="flex justify-between gap-4 py-2 border-b border-ink/20">
              <span>{s.name}</span>
              <span className="text-right text-ink/60">{s.stage}</span>
            </li>
          ))}
        </ol>
        <p className="text-[14px] xl:text-[17px] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
