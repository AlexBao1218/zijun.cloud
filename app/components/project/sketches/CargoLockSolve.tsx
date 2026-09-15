import { Arrow, Frame, small, stroke } from "./common";

/** A fuselage with positions: two locked by hand, the rest placed by the solver; CG gauge on top. */
export default function CargoLockSolve() {
  const cols = [70, 110];
  const rows = [70, 96, 122, 148, 174];
  const fuselage = (x: number) => `M${x + 40} 30q40 0 40 40v120q0 30 -40 30q-40 0 -40 -30v-120q0 -40 40 -40z`;
  const cells = (x0: number, filled: (r: number, c: number) => "lock" | "solved" | "empty", d0: number) =>
    rows.flatMap((y, r) =>
      cols.map((x, c) => {
        const kind = filled(r, c);
        const cx = x0 + x - 70;
        return (
          <g key={`${r}-${c}`}>
            <rect x={cx} y={y} width={30} height={18} {...stroke} strokeWidth={1} fill={kind === "solved" ? "var(--sketch-accent)" : "none"} fillOpacity={kind === "solved" ? 0.25 : 1} data-draw style={{ ["--d" as string]: d0 + r * 0.08 }} />
            {kind === "lock" && <path d={`M${cx + 11} ${y + 9}v-3q0 -4 4 -4t4 4v3M${cx + 9} ${y + 9}h12v7h-12z`} {...stroke} strokeWidth={1} data-draw style={{ ["--d" as string]: d0 + 0.6 }} />}
          </g>
        );
      }),
    );
  return (
    <Frame id="wob-cargo" w={760} h={230} accent="var(--proj-cathay)">
      {/* left: before solve — two locks */}
      <path d={fuselage(80)} {...stroke} data-draw style={{ ["--d" as string]: 0 }} />
      {cells(80, (r, c) => ((r === 1 && c === 0) || (r === 3 && c === 1) ? "lock" : "empty"), 0.3)}
      <text x={120} y={214} textAnchor="middle" style={small} data-fade>lock what you want to keep</text>

      {/* CG gauge */}
      <path d="M260 60h240" {...stroke} data-draw style={{ ["--d" as string]: 1.0 }} />
      <rect x={350} y={52} width={60} height={16} fill="var(--sketch-accent)" fillOpacity="0.25" stroke="none" data-fade style={{ ["--d" as string]: 1.2 }} />
      <path d="M312 48v24" {...stroke} data-draw style={{ ["--d" as string]: 1.3 }} />
      <path d="M382 48v24" {...stroke} stroke="var(--sketch-accent)" data-draw style={{ ["--d" as string]: 2.6 }} />
      <text x={380} y={40} textAnchor="middle" style={small} data-fade>centre of gravity · target band</text>
      <text x={312} y={88} textAnchor="middle" style={small} data-fade>now</text>
      <text x={382} y={88} textAnchor="middle" style={small} data-fade>after</text>

      <Arrow x1={290} y1={130} x2={470} y2={130} d={1.6} />
      <text x={380} y={122} textAnchor="middle" style={small} data-fade>solve · MILP in the browser</text>

      {/* right: after solve — locks kept, rest filled */}
      <path d={fuselage(600)} {...stroke} data-draw style={{ ["--d" as string]: 1.9 }} />
      {cells(600, (r, c) => ((r === 1 && c === 0) || (r === 3 && c === 1) ? "lock" : "solved"), 2.1)}
      <text x={640} y={214} textAnchor="middle" style={small} data-fade>the rest placed around them</text>
    </Frame>
  );
}
