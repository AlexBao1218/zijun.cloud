/** Shared bits for the hand-drawn sketches. Strokes carry data-draw / data-fade so globals.css can animate them. */
export const INK = "var(--ink)";

export function Wobble({ id }: { id: string }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

export const stroke = { fill: "none", stroke: INK, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace", fontSize: 12, fill: INK } as const;
export const small = { ...mono, fontSize: 10.5, fillOpacity: 0.7 } as const;
export const serif = { fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontSize: 16, fill: INK } as const;

/** A slightly irregular rectangle path (hand-drawn box). */
export function boxPath(x: number, y: number, w: number, h: number) {
  return `M${x + 1} ${y}h${w - 2}q1.5 0.5 1.5 2v${h - 4}q0 1.5 -1.5 2h-${w - 2}q-1.5 -0.5 -1.5 -2v-${h - 4}q0 -1.5 1.5 -2z`;
}

type BoxProps = { x: number; y: number; w: number; h: number; label: string; sub?: string; d?: number; accent?: boolean; dashed?: boolean };

/** Bordered box with a centred mono label and an optional second line. */
export function Box({ x, y, w, h, label, sub, d = 0, accent, dashed }: BoxProps) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <path
        d={boxPath(x, y, w, h)}
        {...stroke}
        stroke={accent ? "var(--sketch-accent)" : INK}
        strokeDasharray={dashed ? "4 3" : undefined}
        data-draw
        style={{ ["--d" as string]: d }}
      />
      <text x={cx} y={sub ? cy - 3 : cy + 4} textAnchor="middle" style={mono} data-fade>{label}</text>
      {sub && <text x={cx} y={cy + 12} textAnchor="middle" style={small} data-fade>{sub}</text>}
    </g>
  );
}

/** Straight arrow from (x1,y1) to (x2,y2) with an arrowhead. */
export function Arrow({ x1, y1, x2, y2, d = 0 }: { x1: number; y1: number; x2: number; y2: number; d?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (t: number) => x2 - 8 * Math.cos(a - t);
  const hy = (t: number) => y2 - 8 * Math.sin(a - t);
  return (
    <g>
      <path d={`M${x1} ${y1}L${x2} ${y2}`} {...stroke} data-draw style={{ ["--d" as string]: d }} />
      <path d={`M${hx(0.5)} ${hy(0.5)}L${x2} ${y2}L${hx(-0.5)} ${hy(-0.5)}`} {...stroke} data-draw style={{ ["--d" as string]: d + 0.15 }} />
    </g>
  );
}

export function Frame({ id, w, h, accent, children }: { id: string; w: number; h: number; accent: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ minWidth: 560, ["--sketch-accent" as string]: accent }} filter={`url(#${id})`}>
      <defs><Wobble id={id} /></defs>
      {children}
    </svg>
  );
}
