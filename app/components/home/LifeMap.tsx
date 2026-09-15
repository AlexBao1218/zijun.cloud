import Sketch from "@/app/components/project/Sketch";
import { Wobble, mono, small, stroke } from "@/app/components/project/sketches/common";

type Stop = { name: string; stage: string; lon: number; lat: number };

/** Simplified outline of China (lon, lat), clockwise from the north-east. Schematic, not survey-grade. */
const OUTLINE: [number, number][] = [
  [135.0, 48.4], [134.0, 47.2], [133.0, 45.0], [131.0, 42.9], [130.6, 42.4], [128.0, 41.4], [126.0, 40.7], [124.4, 40.1],
  [121.6, 38.9], [122.2, 40.4], [121.2, 40.9], [119.2, 39.5], [117.7, 39.0], [118.9, 37.7], [121.4, 37.5], [122.5, 36.9],
  [120.4, 36.1], [119.2, 34.6], [120.9, 33.0], [121.9, 31.2], [121.9, 29.9], [120.7, 28.0], [119.6, 26.1], [118.1, 24.5],
  [116.7, 23.4], [114.2, 22.3], [112.5, 21.7], [110.4, 21.2], [109.1, 21.5], [108.0, 21.5], [106.5, 22.4], [104.0, 22.5],
  [101.7, 21.2], [100.0, 21.6], [98.9, 24.0], [97.5, 26.0], [98.7, 27.8], [97.0, 28.4], [95.3, 29.3], [91.7, 27.7],
  [88.1, 27.9], [84.2, 28.6], [81.2, 30.1], [79.0, 31.5], [78.9, 34.4], [75.5, 36.8], [74.5, 37.2], [73.6, 39.4],
  [75.0, 40.5], [79.9, 42.1], [80.2, 44.9], [82.3, 45.5], [85.5, 47.1], [87.7, 49.2], [90.7, 47.5], [95.0, 44.3],
  [97.0, 42.7], [100.0, 42.6], [104.0, 41.8], [107.0, 42.4], [111.0, 43.5], [114.0, 44.9], [116.2, 46.4], [118.0, 46.7],
  [119.9, 47.0], [116.7, 49.8], [119.5, 50.4], [121.5, 53.3], [123.5, 53.5], [126.0, 52.7], [127.5, 50.2], [130.7, 48.9],
];
const HAINAN: [number, number][] = [[108.6, 19.9], [109.6, 20.1], [111.0, 19.7], [110.5, 18.4], [109.2, 18.3], [108.6, 19.2]];
const TAIWAN: [number, number][] = [[121.0, 25.2], [121.9, 25.0], [121.9, 24.4], [121.4, 22.6], [120.8, 21.9], [120.2, 23.0], [120.4, 24.4]];

const W = 760;
const H = 520;
const project = ([lon, lat]: [number, number]) => [((lon - 73) / (136 - 73)) * (W - 40) + 20, ((54 - lat) / (54 - 17)) * (H - 40) + 20] as const;
const path = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${project(p).map((v) => v.toFixed(1)).join(" ")}`).join(" ") + "Z";

/** Hand-drawn map of China with the places Alex has lived, joined in order; draws itself when scrolled into view. */
export default function LifeMap({ title, stops }: { title: string; stops: Stop[] }) {
  const pts = stops.map((s) => project([s.lon, s.lat]));
  const route = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <Sketch label={`${title}: ${stops.map((s) => `${s.stage} in ${s.name}`).join(", ")}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 560 }} filter="url(#wob-map)">
        <defs><Wobble id="wob-map" /></defs>
        <text x={20} y={30} style={mono} data-fade>{title}</text>
        <path d={path(OUTLINE)} {...stroke} strokeWidth={1.2} data-draw style={{ ["--d" as string]: 0 }} />
        <path d={path(HAINAN)} {...stroke} strokeWidth={1.2} data-draw style={{ ["--d" as string]: 0.8 }} />
        <path d={path(TAIWAN)} {...stroke} strokeWidth={1.2} data-draw style={{ ["--d" as string]: 0.9 }} />
        <path d={route} {...stroke} stroke="var(--pop)" strokeWidth={1.8} strokeDasharray="5 4" data-draw style={{ ["--d" as string]: 1.2 }} />
        {stops.map((s, i) => {
          const [x, y] = pts[i];
          const right = s.lon > 112;
          const tx = right ? x + 12 : x - 12;
          const anchor = right ? "start" : "end";
          return (
            <g key={s.name}>
              <circle cx={x} cy={y} r={4.5} fill="var(--pop)" stroke="var(--paper)" strokeWidth={2} data-fade style={{ ["--d" as string]: 1.4 + i * 0.35 }} />
              <text x={tx} y={y - 2} textAnchor={anchor} style={mono} data-fade>{s.name}</text>
              <text x={tx} y={y + 12} textAnchor={anchor} style={small} data-fade>{s.stage}</text>
            </g>
          );
        })}
      </svg>
    </Sketch>
  );
}
