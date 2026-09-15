import { INK, Wobble, box, mono, serif } from "./common";

/** Before: a four-step loop that ends where it began. After: three record types linked once, feeding a dashboard and an assistant. */
export default function InsuranceLoop() {
  const stroke = { fill: "none", stroke: INK, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 760 250" width="100%" style={{ minWidth: 560 }} filter="url(#wob-ins)">
      <defs><Wobble id="wob-ins" /></defs>

      {/* BEFORE — the loop */}
      <text x="16" y="20" style={mono} data-fade>BEFORE</text>
      {[["ask", 16], ["search", 106], ["count by hand", 196], ["reply", 306]].map(([t, x], i) => (
        <g key={String(t)}>
          <path d={box(Number(x), 40, i === 2 ? 100 : 76, 34)} {...stroke} data-draw style={{ ["--d" as string]: i * 0.25 }} />
          <text x={Number(x) + 8} y="61" style={mono} data-fade>{t}</text>
        </g>
      ))}
      {[92, 182, 296].map((x, i) => (
        <path key={x} d={`M${x} 57h12`} {...stroke} data-draw style={{ ["--d" as string]: 0.15 + i * 0.25 }} />
      ))}
      {/* return arrow: reply → ask */}
      <path d="M344 74q0 40 -80 40h-190q-40 0 -40 -40" {...stroke} strokeDasharray="4 4" data-draw style={{ ["--d" as string]: 1.1 }} />
      <path d="M28 82l6-8 6 8" {...stroke} data-draw style={{ ["--d" as string]: 1.5 }} />
      <text x="110" y="132" style={serif} data-fade>hours, sometimes days · then the next question starts the loop again</text>

      {/* AFTER — link once, answer two ways */}
      <text x="16" y="172" style={mono} data-fade>AFTER</text>
      {[["summary", 16], ["claims", 96], ["policies (pdf)", 176]].map(([t, x], i) => (
        <g key={String(t)}>
          <path d={box(Number(x), 186, i === 2 ? 108 : 72, 34)} {...stroke} data-draw style={{ ["--d" as string]: 1.8 + i * 0.2 }} />
          <text x={Number(x) + 8} y="207" style={mono} data-fade>{t}</text>
        </g>
      ))}
      {/* links underneath: linked once */}
      <path d="M52 220q0 22 62 22q54 0 58 -22M132 220q0 22 48 22q46 0 52 -22" {...stroke} data-draw style={{ ["--d" as string]: 2.4 }} />
      <text x="70" y="248" style={mono} data-fade>linked once · 34 classes · 15 years</text>

      {/* arrow to two answers */}
      <path d="M300 203h60" {...stroke} data-draw style={{ ["--d" as string]: 2.7 }} />
      <path d="M354 197l8 6 -8 6" {...stroke} data-draw style={{ ["--d" as string]: 2.9 }} />
      <path d="M372 203q30 0 30 -22h20M372 203q30 0 30 22h20" {...stroke} data-draw style={{ ["--d" as string]: 3.0 }} />

      <path d={box(426, 166, 150, 34)} {...stroke} data-draw style={{ ["--d" as string]: 3.2 }} />
      <text x="434" y="187" style={mono} data-fade>dashboard · fixed questions</text>
      <path d={box(426, 210, 150, 34)} {...stroke} data-draw style={{ ["--d" as string]: 3.4 }} />
      <text x="434" y="231" style={mono} data-fade>assistant · anything else</text>

      {/* assistant fans out to chat + report */}
      <path d="M580 227h24q14 0 14 -12h20M580 227h24q14 0 14 12h20" {...stroke} data-draw style={{ ["--d" as string]: 3.7 }} />
      <text x="642" y="219" style={mono} data-fade>chat</text>
      <text x="642" y="243" style={mono} data-fade>4-page report</text>
    </svg>
  );
}
