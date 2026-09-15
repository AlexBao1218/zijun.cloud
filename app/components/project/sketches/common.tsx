/** Shared bits for the hand-drawn sketches: a wobble filter and typographic defaults. Strokes carry data-draw so globals.css can animate them. */
export const INK = "var(--ink)";
export const PAPER = "var(--paper)";

export function Wobble({ id }: { id: string }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

export const mono = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace", fontSize: 11, fill: INK } as const;
export const serif = { fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontSize: 15, fill: INK } as const;

/** A slightly irregular rectangle path (hand-drawn box). */
export function box(x: number, y: number, w: number, h: number) {
  return `M${x + 1} ${y}h${w - 2}q${1.5} ${0.5} ${1.5} ${2}v${h - 4}q0 ${1.5} -${1.5} ${2}h-${w - 2}q-${1.5} -0.5 -${1.5} -${2}v-${h - 4}q0 -${1.5} ${1.5} -${2}z`;
}
