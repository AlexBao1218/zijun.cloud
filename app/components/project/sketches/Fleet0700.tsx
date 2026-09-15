import { INK, Wobble, box, mono, serif } from "./common";

/** The 07:00 job: approved change due today → two checks → write, or write nothing → coordinator notified either way. */
export default function Fleet0700() {
  const stroke = { fill: "none", stroke: INK, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const accent = { ...stroke, stroke: "var(--proj-towngas)" };
  return (
    <svg viewBox="0 0 760 210" width="100%" style={{ minWidth: 560 }} filter="url(#wob-fleet)">
      <defs><Wobble id="wob-fleet" /></defs>

      {/* clock */}
      <circle cx="44" cy="70" r="24" {...stroke} data-draw style={{ ["--d" as string]: 0 }} />
      <path d="M44 70v-14M44 70l9 6" {...accent} data-draw style={{ ["--d" as string]: 0.3 }} />
      <text x="20" y="118" style={mono} data-fade>07:00 daily</text>

      <path d="M76 70h30" {...stroke} data-draw style={{ ["--d" as string]: 0.5 }} />
      <path d="M100 64l8 6 -8 6" {...stroke} data-draw style={{ ["--d" as string]: 0.6 }} />

      <path d={box(112, 50, 124, 40)} {...stroke} data-draw style={{ ["--d" as string]: 0.7 }} />
      <text x="122" y="68" style={mono} data-fade>approved change</text>
      <text x="122" y="83" style={mono} data-fade>due today</text>

      <path d="M240 70h30" {...stroke} data-draw style={{ ["--d" as string]: 1.0 }} />
      <path d="M264 64l8 6 -8 6" {...stroke} data-draw style={{ ["--d" as string]: 1.1 }} />

      {/* diamond: two checks */}
      <path d="M330 30l58 40 -58 40 -58 -40z" {...stroke} data-draw style={{ ["--d" as string]: 1.2 }} />
      <text x="304" y="66" style={mono} data-fade>two checks</text>
      <text x="290" y="128" style={serif} data-fade>from = still current?  to = on the list?</text>

      {/* pass */}
      <path d="M388 70h60" {...stroke} data-draw style={{ ["--d" as string]: 1.6 }} />
      <text x="400" y="62" style={mono} data-fade>pass</text>
      <path d="M442 64l8 6 -8 6" {...stroke} data-draw style={{ ["--d" as string]: 1.8 }} />
      <path d={box(456, 50, 120, 40)} {...accent} data-draw style={{ ["--d" as string]: 1.9 }} />
      <text x="466" y="68" style={mono} data-fade>fleet list</text>
      <text x="466" y="83" style={mono} data-fade>updated</text>

      {/* fail */}
      <path d="M330 110v50q0 12 12 12h100" {...stroke} data-draw style={{ ["--d" as string]: 1.6 }} />
      <text x="340" y="150" style={mono} data-fade>fail</text>
      <path d="M436 166l8 6 -8 6" {...stroke} data-draw style={{ ["--d" as string]: 1.9 }} />
      <path d={box(456, 152, 120, 40)} {...stroke} strokeDasharray="4 3" data-draw style={{ ["--d" as string]: 2.0 }} />
      <text x="466" y="170" style={mono} data-fade>nothing</text>
      <text x="466" y="185" style={mono} data-fade>written</text>

      {/* both → outlook notice */}
      <path d="M580 70h40v102h-40M620 121h44" {...stroke} data-draw style={{ ["--d" as string]: 2.3 }} />
      <path d="M658 115l8 6 -8 6" {...stroke} data-draw style={{ ["--d" as string]: 2.6 }} />
      <path d={box(672, 101, 76, 40)} {...stroke} data-draw style={{ ["--d" as string]: 2.7 }} />
      <path d="M680 109l30 16 30 -16" {...stroke} data-draw style={{ ["--d" as string]: 2.9 }} />
      <text x="676" y="135" style={mono} data-fade>notice</text>
    </svg>
  );
}
