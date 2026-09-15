import Sketch from "@/app/components/project/Sketch";
import { Wobble, mono, stroke } from "@/app/components/project/sketches/common";
import { CHINA_H, CHINA_PATHS, CHINA_W } from "@/lib/china-outline";

type Stop = { name: string; stage: string; lon: number; lat: number };
type Props = { title: string; lede: string; text: string; stops: Stop[] };
type Pt = readonly [number, number];

const P = 16;
const project = (lon: number, lat: number): Pt =>
  [((lon - 73) / (136 - 73)) * (CHINA_W - 2 * P) + P, ((54 - lat) / (54 - 17)) * (CHINA_H - 2 * P) + P];

/** Catmull-Rom spline through the stops, sampled densely so footprints can be laid along it. */
function samplePath(pts: Pt[], perSeg = 40): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg, t2 = t * t, t3 = t2 * t;
      const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([x, y]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Footprints every `step` px along the sampled path, alternating left/right of the line, rotated to face the way of travel. */
function footprints(samples: Pt[], step = 22) {
  const feet: { x: number; y: number; angle: number; side: 1 | -1 }[] = [];
  let acc = 0, side: 1 | -1 = 1;
  for (let i = 1; i < samples.length; i++) {
    const [x0, y0] = samples[i - 1], [x1, y1] = samples[i];
    const d = Math.hypot(x1 - x0, y1 - y0);
    acc += d;
    if (acc >= step) {
      const angle = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90;
      const nx = -(y1 - y0) / d, ny = (x1 - x0) / d; // unit normal
      feet.push({ x: x1 + nx * 4 * side, y: y1 + ny * 4 * side, angle, side });
      side = side === 1 ? -1 : 1;
      acc = 0;
    }
  }
  return feet;
}

/** Map of China (real outline, drawn in ink); the places Alex has lived are joined by a winding trail of footprints. */
export default function LifeMap({ title, lede, text, stops }: Props) {
  const pts = stops.map((s) => project(s.lon, s.lat));
  const feet = footprints(samplePath(pts));
  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_320px] gap-10 md:gap-14 items-center">
      <Sketch label={`${title}: ${stops.map((s) => `${s.stage} in ${s.name}`).join(", ")}`}>
        <svg viewBox={`0 0 ${CHINA_W} ${CHINA_H}`} width="100%" style={{ minWidth: 520 }} filter="url(#wob-map)">
          <defs>
            <Wobble id="wob-map" />
            {/* one footprint: sole + heel, toes as dots; mirrored for the other foot */}
            <g id="foot">
              <ellipse cx="0" cy="1.5" rx="2.3" ry="3.4" />
              <ellipse cx="0" cy="-3.6" rx="1.6" ry="1.2" />
            </g>
          </defs>
          {CHINA_PATHS.map((d, i) => (
            <path key={i} d={d} {...stroke} strokeWidth={1.2} data-draw style={{ ["--d" as string]: i * 0.3, strokeDasharray: 8000, strokeDashoffset: 8000 }} />
          ))}
          {feet.map((f, i) => (
            <use
              key={i}
              href="#foot"
              fill="var(--pop)"
              transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) rotate(${f.angle.toFixed(1)}) scale(${f.side} 1)`}
              data-fade
              style={{ ["--d" as string]: 1.0 + i * 0.045 }}
            />
          ))}
          {stops.map((s, i) => {
            const [x, y] = pts[i];
            const right = s.lon > 112;
            const dy = s.name === "hong kong" ? 16 : 4;
            return (
              <g key={s.name}>
                <circle cx={x} cy={y} r={4.5} fill="var(--ink)" stroke="var(--paper)" strokeWidth={2} data-fade style={{ ["--d" as string]: 0.9 + i * 0.5 }} />
                <text x={right ? x + 11 : x - 11} y={y + dy} textAnchor={right ? "start" : "end"} style={mono} data-fade>{s.name}</text>
              </g>
            );
          })}
        </svg>
      </Sketch>
      <div className="grid gap-6">
        <p className="font-serif italic text-[22px] md:text-[26px] leading-snug">{lede}</p>
        <p className="text-[14px] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
