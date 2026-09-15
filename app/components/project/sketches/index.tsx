import type { SketchKey } from "@/lib/projects";
import InsuranceLink from "./InsuranceLink";
import FleetThree from "./FleetThree";
import MinutesTwoPass from "./MinutesTwoPass";
import CargoLockSolve from "./CargoLockSolve";
import IgcAlarmAgent from "./IgcAlarmAgent";

export const SKETCH_COMPONENTS: Record<SketchKey, { Component: () => React.JSX.Element; label: string }> = {
  "insurance-link": { Component: InsuranceLink, label: "Insurance summary, claims list and policy PDFs, linked only by reference number, become one data layer (class → policy → claim) that feeds a dashboard for the monthly questions and an assistant for everything else." },
  "fleet-three": { Component: FleetThree, label: "Before: an email, 37 folders and a 48-column sheet. After: one app with look up, request and approve." },
  "minutes-two-pass": { Component: MinutesTwoPass, label: "A Cantonese transcript goes through one pass to understand and one to write, then fills the department's Word template itself." },
  "cargo-lock-solve": { Component: CargoLockSolve, label: "Lock two positions on the 747; the solver fills the rest and the centre of gravity moves into the target band." },
  "igc-alarm-agent": { Component: IgcAlarmAgent, label: "An alarm on the 3-D twin, the matching specialist agent out of six, and an answer with the manual page it came from." },
};
