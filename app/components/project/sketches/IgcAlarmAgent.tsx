import { Arrow, Box, Frame, small, stroke } from "./common";

/** Alarm on the twin → pick the matching specialist agent → answer with the source page. */
export default function IgcAlarmAgent() {
  const agents = ["MVAC", "electrical", "ELV", "plumbing", "fire", "lifts"];
  return (
    <Frame id="wob-igc" w={760} h={210} accent="var(--proj-igc)">
      {/* alarm on the twin */}
      <path d="M40 40h190v120h-190z" {...stroke} data-draw style={{ ["--d" as string]: 0 }} />
      <path d="M60 130l40 -30l40 20l60 -40" {...stroke} strokeWidth={1} data-draw style={{ ["--d" as string]: 0.3 }} />
      <path d="M150 70h30v22h-30z" fill="var(--sketch-accent)" fillOpacity="0.25" stroke="var(--sketch-accent)" strokeWidth={1.5} data-draw style={{ ["--d" as string]: 0.6 }} />
      <text x={135} y={180} textAnchor="middle" style={small} data-fade>an alarm on the 3-D twin</text>

      <Arrow x1={240} y1={100} x2={290} y2={100} d={0.9} />

      {/* six agents */}
      <path d="M300 40h150v120h-150z" {...stroke} data-draw style={{ ["--d" as string]: 1.1 }} />
      {agents.map((a, i) => (
        <text key={a} x={316} y={62 + i * 17} style={{ ...small, fillOpacity: i === 0 ? 1 : 0.6 }} data-fade>
          {i === 0 ? "▸ " : "  "}{a} engineer
        </text>
      ))}
      <text x={375} y={180} textAnchor="middle" style={small} data-fade>pick the specialist</text>

      <Arrow x1={460} y1={100} x2={510} y2={100} d={1.5} />

      {/* answer with sources */}
      <Box x={520} y={40} w={200} h={120} label="answer" sub="with its source page" d={1.7} accent />
      <text x={620} y={180} textAnchor="middle" style={small} data-fade>grounded in 1,000+ documents</text>
    </Frame>
  );
}
