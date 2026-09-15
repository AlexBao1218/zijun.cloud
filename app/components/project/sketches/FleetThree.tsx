import { Arrow, Box, Frame, serif, stroke } from "./common";

/** Before: an email, 37 folders, a 48-column sheet. After: one app with three things in it. */
export default function FleetThree() {
  return (
    <Frame id="wob-fleet" w={760} h={210} accent="var(--proj-cathay)">
      <text x={40} y={30} style={serif} data-fade>before</text>
      <Box x={40} y={44} w={150} h={40} label="an email" d={0} />
      <Box x={40} y={96} w={150} h={40} label="37 folders" d={0.15} />
      <Box x={40} y={148} w={150} h={40} label="48-column sheet" d={0.3} />

      <Arrow x1={220} y1={116} x2={300} y2={116} d={0.8} />

      <text x={330} y={30} style={serif} data-fade>after</text>
      <path d="M330 44h390v144h-390z" {...stroke} stroke="var(--sketch-accent)" data-draw style={{ ["--d" as string]: 1.0 }} />
      <Box x={345} y={64} w={110} h={104} label="look up" sub="plate → record" d={1.3} />
      <Box x={470} y={64} w={110} h={104} label="request" sub="form pre-fills" d={1.5} />
      <Box x={595} y={64} w={110} h={104} label="approve" sub="grouped by plate" d={1.7} />
    </Frame>
  );
}
