import { Arrow, Box, Frame, serif } from "./common";

/** Three stores that only point at each other by number → linked once → dashboard for fixed questions, assistant for the rest. */
export default function InsuranceLink() {
  return (
    <Frame id="wob-ins" w={760} h={230} accent="var(--proj-towngas)">
      <Box x={40} y={24} w={140} h={44} label="insurance summary" d={0} />
      <Box x={310} y={24} w={140} h={44} label="claims list" d={0.15} />
      <Box x={580} y={24} w={140} h={44} label="policy PDFs" d={0.3} />
      <path d="M180 46h130M450 46h130" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 5" data-draw style={{ ["--d" as string]: 0.45 }} />
      <text x={380} y={90} textAnchor="middle" style={serif} data-fade>linked only by reference number</text>

      <Arrow x1={380} y1={98} x2={380} y2={126} d={0.9} />
      <Box x={230} y={128} w={300} h={44} label="one data layer" sub="class → policy → claim" d={1.1} accent />

      <Arrow x1={330} y1={172} x2={190} y2={196} d={1.6} />
      <Arrow x1={430} y1={172} x2={570} y2={196} d={1.6} />
      <Box x={60} y={196} w={260} h={30} label="dashboard · the questions asked every month" d={1.9} />
      <Box x={440} y={196} w={260} h={30} label="assistant · everything else, with sources" d={1.9} />
    </Frame>
  );
}
