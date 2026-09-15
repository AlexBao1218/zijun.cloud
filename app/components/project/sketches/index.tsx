import type { SketchKey } from "@/lib/projects";
import InsuranceLoop from "./InsuranceLoop";
import Fleet0700 from "./Fleet0700";
import MinutesTwoPass from "./MinutesTwoPass";

export const SKETCH_COMPONENTS: Record<SketchKey, { Component: () => React.JSX.Element; label: string }> = {
  "insurance-loop": { Component: InsuranceLoop, label: "Before: ask, search, count by hand, reply, repeat. After: summary, claims and policies linked once, feeding a dashboard for fixed questions and an assistant for everything else." },
  "fleet-0700": { Component: Fleet0700, label: "Every day at 07:00 an approved change due today passes two checks; on pass the fleet list is updated, on fail nothing is written; the coordinator is notified either way." },
  "minutes-two-pass": { Component: MinutesTwoPass, label: "A Cantonese transcript goes through one LLM pass to understand and one to write, then a script fills the department's Word template itself." },
};
