export const PROJECT_COLOURS = ["towngas", "cathay", "neochain", "igc"] as const;
export type ProjectColour = (typeof PROJECT_COLOURS)[number];

/** Full class names must appear literally so Tailwind v4 emits them. */
export const BG_CLASS: Record<ProjectColour, string> = {
  towngas: "bg-towngas",
  cathay: "bg-cathay",
  neochain: "bg-neochain",
  igc: "bg-igc",
};

export const BORDER_CLASS: Record<ProjectColour, string> = {
  towngas: "border-towngas",
  cathay: "border-cathay",
  neochain: "border-neochain",
  igc: "border-igc",
};

export const UNDERLINE_CLASS: Record<ProjectColour, string> = {
  towngas: "decoration-towngas",
  cathay: "decoration-cathay",
  neochain: "decoration-neochain",
  igc: "decoration-igc",
};

export type WorkCardData = {
  slug: string;
  title: string;
  org: string;
  duration: string;
  role: string;
  kind: string;
  colour: ProjectColour;
  cover?: string;
};

export type ProjectSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  quote?: string;
};

export type ProjectContent = {
  title: string;
  org: string;
  duration: string;
  role: string;
  colour: ProjectColour;
  summary: string;
  demo: {
    mode: "embed" | "recording" | "static";
    url?: string;
    video?: string;
    poster?: string;
    height?: number;
    /** Native layout width; DemoFrame scales the iframe down when the box is narrower. */
    width?: number;
  };
  links: { label: string; url: string }[];
  facts: { label: string; value: string }[];
  guide?: { heading: string; steps: string[] };
  sections: ProjectSection[];
  tags: string[];
};
