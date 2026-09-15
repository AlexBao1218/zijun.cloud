import { Arrow, Box, Frame, small, stroke } from "./common";

/** Transcript → pass one understands → pass two writes → the template itself. */
export default function MinutesTwoPass() {
  return (
    <Frame id="wob-min" w={760} h={190} accent="var(--proj-neochain)">
      <Box x={30} y={50} w={130} h={56} label="transcript" sub="cantonese" d={0} />
      <Arrow x1={160} y1={78} x2={200} y2={78} d={0.4} />
      <Box x={202} y={50} w={150} h={56} label="pass 1 · understand" d={0.6} />
      <text x={277} y={128} textAnchor="middle" style={small} data-fade>fix errors · 7 sections · flag doubts</text>
      <Arrow x1={352} y1={78} x2={392} y2={78} d={1.0} />
      <Box x={394} y={50} w={150} h={56} label="pass 2 · write" d={1.2} />
      <text x={469} y={128} textAnchor="middle" style={small} data-fade>formal tone · numbers kept</text>
      <Arrow x1={544} y1={78} x2={584} y2={78} d={1.6} />
      {/* the template page */}
      <path d="M590 36h130v90h-130z" {...stroke} stroke="var(--sketch-accent)" data-draw style={{ ["--d" as string]: 1.8 }} />
      {[52, 66, 80, 94, 108].map((y, i) => (
        <path key={y} d={`M602 ${y}h106`} {...stroke} strokeWidth={1} data-draw style={{ ["--d" as string]: 2.0 + i * 0.05 }} />
      ))}
      <path d="M602 72h34v12h-34z" fill="var(--sketch-accent)" fillOpacity="0.25" stroke="none" data-fade style={{ ["--d" as string]: 2.4 }} />
      <text x={655} y={146} textAnchor="middle" style={small} data-fade>the template itself</text>
      <text x={655} y={160} textAnchor="middle" style={small} data-fade>doubts flagged in place</text>
    </Frame>
  );
}
