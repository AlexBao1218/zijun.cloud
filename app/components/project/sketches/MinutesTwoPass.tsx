import { INK, Wobble, box, mono, serif } from "./common";

/** Transcript → LLM 1 (understand) → LLM 2 (write) → script → the template itself. */
export default function MinutesTwoPass() {
  const stroke = { fill: "none", stroke: INK, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const accent = { ...stroke, stroke: "var(--proj-towngas)" };
  const arrow = (x: number, d: number) => (
    <g key={x}>
      <path d={`M${x} 70h26`} {...stroke} data-draw style={{ ["--d" as string]: d }} />
      <path d={`M${x + 20} 64l8 6 -8 6`} {...stroke} data-draw style={{ ["--d" as string]: d + 0.1 }} />
    </g>
  );
  return (
    <svg viewBox="0 0 764 200" width="100%" style={{ minWidth: 560 }} filter="url(#wob-min)">
      <defs><Wobble id="wob-min" /></defs>

      {/* transcript: wavy lines on a sheet */}
      <path d={box(16, 40, 96, 60)} {...stroke} data-draw style={{ ["--d" as string]: 0 }} />
      {[54, 64, 74, 84].map((y, i) => (
        <path key={y} d={`M26 ${y}q10 -3 20 0t20 0t20 0t16 0`} {...stroke} strokeWidth={1} data-draw style={{ ["--d" as string]: 0.2 + i * 0.08 }} />
      ))}
      <text x="18" y="120" style={mono} data-fade>cantonese transcript</text>

      {arrow(116, 0.6)}

      <path d={box(148, 40, 160, 60)} {...stroke} data-draw style={{ ["--d" as string]: 0.8 }} />
      <text x="158" y="60" style={mono} data-fade>LLM 1 · understand</text>
      <text x="158" y="76" style={mono} data-fade>fix hearing errors</text>
      <text x="158" y="90" style={mono} data-fade>7 sections · flag doubts</text>

      {arrow(312, 1.2)}

      <path d={box(344, 40, 140, 60)} {...stroke} data-draw style={{ ["--d" as string]: 1.4 }} />
      <text x="354" y="60" style={mono} data-fade>LLM 2 · write</text>
      <text x="354" y="76" style={mono} data-fade>formal tone</text>
      <text x="354" y="90" style={mono} data-fade>numbers untouched</text>

      {arrow(488, 1.8)}

      <path d={box(520, 40, 84, 60)} {...stroke} data-draw style={{ ["--d" as string]: 2.0 }} />
      <text x="530" y="66" style={mono} data-fade>script</text>
      <text x="530" y="82" style={mono} data-fade>fills template</text>

      {arrow(608, 2.3)}

      {/* the template itself: page with fixed rows */}
      <path d={box(640, 28, 110, 84)} {...accent} data-draw style={{ ["--d" as string]: 2.5 }} />
      {[42, 56, 70, 84, 98].map((y, i) => (
        <path key={y} d={`M650 ${y}h90`} {...stroke} strokeWidth={1} data-draw style={{ ["--d" as string]: 2.7 + i * 0.06 }} />
      ))}
      <path d="M652 62h30v10h-30z" {...accent} fill="var(--proj-towngas)" fillOpacity="0.18" data-draw style={{ ["--d" as string]: 3.0 }} />
      <text x="640" y="132" style={mono} data-fade>the template itself</text>
      <text x="640" y="148" style={mono} data-fade>doubts flagged in place</text>

      <text x="148" y="170" style={serif} data-fade>two passes on purpose: missing content → fix pass 1;  wrong tone → fix pass 2</text>
    </svg>
  );
}
