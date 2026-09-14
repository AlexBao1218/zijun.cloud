# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild zijun.cloud as a single long-scroll, neo-brutalist portfolio (paper ground, ink rules, hard-offset cards, per-project colours) with six work cards and demo-centred project pages, per `docs/superpowers/specs/2026-09-14-portfolio-v2-design.md`.

**Architecture:** Next.js 16 App Router + next-intl stays. The home page becomes one Server Component that composes five section components, each reading its own `content/<section>/<locale>.json`. Project pages keep the `[slug]` route but get a new JSON schema (demo mode, guide steps, facts, sections). Three small Client Components carry the only interactivity: top bar locale toggle, demo iframe activation, photo lightbox. A `node:test` suite validates every content file so schema drift fails `npm test` before `next build`.

**Tech Stack:** Next.js 16.2 (App Router, `proxy.ts`, `next/font/google`, `next/image`), React 19, Tailwind CSS v4 (`@theme inline` tokens), next-intl 4.8, Node 24 `node:test`, headless Google Chrome for screenshots.

**Branch:** `feat/portfolio-v2` (already created; spec committed). All commits go here. `main` stays untouched.

**Never run bare `git add -A` or `git add .`:** the repo root holds untracked files that belong to Alex (`SKILL.md`, `examples.md`, `reference.md`, `skills/`, `.claude-design/`, a modified `README.md` and `.claude/settings.local.json`). Always add explicit paths.

**Read before coding:** `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`, `.../01-getting-started/13-fonts.md`, `.../03-api-reference/02-components/image.md`. AGENTS.md says this Next.js differs from training data.

---

## File map

| Path | Responsibility |
|------|----------------|
| `tests/content.test.mjs` | Validates every `content/**/{en,zh}.json` against the schemas below |
| `proxy.ts` | Replaces deprecated `middleware.ts` (same next-intl handler) |
| `app/globals.css` | Design tokens (paper/ink/fill/project colours), fonts, `.hatch` placeholder pattern |
| `app/[locale]/layout.tsx` | Fonts (Instrument Serif, Geist Mono, Noto Serif SC), metadata, `<TopBar />` |
| `app/[locale]/page.tsx` | Home: composes Hero, WorkGrid, SkillsSection, AboutSection, ContactSection |
| `app/[locale]/projects/[slug]/page.tsx` | Project detail page |
| `app/components/TopBar.tsx` | Fixed bordered header: name, anchor links, resume, locale toggle (client) |
| `app/components/OffsetBox.tsx` | Hard-shadow block: colour block + bordered face that slides on hover |
| `app/components/SectionStarter.tsx` | Full-width bordered strip with section title + subtitle, carries the anchor id |
| `app/components/home/Hero.tsx` | Availability tag + identity sentence + empty image slot |
| `app/components/home/WorkGrid.tsx` | Six `WorkCard`s |
| `app/components/home/WorkCard.tsx` | One card inside an `OffsetBox` |
| `app/components/home/SkillsSection.tsx` | Methods / Tools / Technical tag groups + languages |
| `app/components/home/AboutSection.tsx` | Paragraph + `PhotoRow` |
| `app/components/home/PhotoRow.tsx` | Photo strip with lightbox (client) |
| `app/components/home/ContactSection.tsx` | Mail button, GitHub, CV, footer |
| `app/components/project/DemoFrame.tsx` | Desktop iframe with click-to-interact, mobile fallback (client) |
| `app/components/project/DemoRecording.tsx` | `<video>` or poster fallback |
| `app/components/project/DemoStatic.tsx` | Cover image or hatch |
| `app/components/project/GuideSteps.tsx` | Numbered "how to try it" list |
| `lib/projects.ts` | Colour key → Tailwind class maps, shared types |
| `lib/content.ts` | unchanged |
| `content/home/*.json` | Hero copy |
| `content/work/*.json` | Card list (replaces `content/projects/_index`) |
| `content/skills/*.json` | Skill groups |
| `content/about/*.json` | Paragraph + photo list |
| `content/contact/*.json` | Links + footer |
| `content/projects/<slug>/*.json` | Six project pages, new schema |
| `messages/*.json` | Nav labels + project page UI strings only |
| `public/cv.pdf` | New CV |
| `public/projects/<slug>/cover.png` | Card covers (4 demos) |
| `DESIGN.md`, `CLAUDE.md`, `app/[locale]/**/CLAUDE.md` | Updated agent docs |

Deleted: `middleware.ts`, `app/[locale]/about/`, `app/[locale]/blog/`, `app/[locale]/contact/`, `app/[locale]/projects/page.tsx`, `app/components/Navigation.tsx`, `app/components/PageHeader.tsx`, `app/components/SectionContainer.tsx`, `app/components/TagList.tsx`, `content/blog/`, `content/projects/_index/`.

## Content schemas

```ts
// content/home/{locale}.json
{ availability: string; lead: string; identities: string[]; closing: string }

// content/work/{locale}.json
{ title: string; subtitle: string;
  cards: { slug; title; org; duration; role; kind; colour: "towngas"|"cathay"|"neochain"|"igc"; cover?: string }[] }

// content/skills/{locale}.json
{ title; subtitle; groups: { name: string; items: string[] }[]; languagesLabel: string; languages: string }

// content/about/{locale}.json
{ title; subtitle; paragraphs: string[]; photosIntro: string; photos: { src: string; alt: string }[] }

// content/contact/{locale}.json
{ mailLabel; email; githubLabel; githubUrl; cvLabel; cvUrl; footer: string }

// content/projects/<slug>/{locale}.json
{ title; org; duration; role; colour; summary: string;
  demo: { mode: "embed"|"recording"|"static"; url?: string; video?: string; poster?: string; height?: number };
  links: { label: string; url: string }[];
  facts: { label: string; value: string }[];
  guide?: { heading: string; steps: string[] };
  sections: { heading: string; paragraphs: string[]; bullets?: string[]; quote?: string }[];
  tags: string[] }
```

---

### Task 1: Content validator (red)

**Files:**
- Create: `tests/content.test.mjs`
- Modify: `package.json` (add `test` script)

- [ ] **Step 1: Write the test file**

```js
// tests/content.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("content");
const LOCALES = ["en", "zh"];
const COLOURS = ["towngas", "cathay", "neochain", "igc"];
const DEMO_MODES = ["embed", "recording", "static"];

const read = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
const isStr = (v) => typeof v === "string" && v.length > 0;
const strArray = (v) => Array.isArray(v) && v.every(isStr);

const projectSlugs = () =>
  fs.readdirSync(path.join(ROOT, "projects"), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_"))
    .map((e) => e.name);

for (const locale of LOCALES) {
  test(`home/${locale}`, () => {
    const h = read(`home/${locale}.json`);
    for (const k of ["availability", "lead", "closing"]) assert.ok(isStr(h[k]), k);
    assert.ok(strArray(h.identities) && h.identities.length >= 2, "identities");
  });

  test(`work/${locale}`, () => {
    const w = read(`work/${locale}.json`);
    assert.ok(isStr(w.title) && isStr(w.subtitle));
    assert.ok(Array.isArray(w.cards) && w.cards.length === 6, "six cards");
    for (const c of w.cards) {
      for (const k of ["slug", "title", "org", "duration", "role", "kind"]) assert.ok(isStr(c[k]), `${c.slug}.${k}`);
      assert.ok(COLOURS.includes(c.colour), `${c.slug}.colour`);
      assert.ok(fs.existsSync(path.join(ROOT, "projects", c.slug, `${locale}.json`)), `${c.slug} has project json`);
      if (c.cover) assert.ok(fs.existsSync(path.join("public", c.cover)), `${c.slug} cover exists`);
    }
  });

  test(`skills/${locale}`, () => {
    const s = read(`skills/${locale}.json`);
    assert.ok(isStr(s.title) && isStr(s.subtitle) && isStr(s.languagesLabel) && isStr(s.languages));
    assert.ok(Array.isArray(s.groups) && s.groups.length === 3, "three groups");
    for (const g of s.groups) assert.ok(isStr(g.name) && strArray(g.items) && g.items.length > 0, g.name);
  });

  test(`about/${locale}`, () => {
    const a = read(`about/${locale}.json`);
    assert.ok(isStr(a.title) && isStr(a.subtitle) && isStr(a.photosIntro));
    assert.ok(strArray(a.paragraphs) && a.paragraphs.length >= 1);
    assert.ok(Array.isArray(a.photos) && a.photos.length >= 4, "photos");
    for (const p of a.photos) {
      assert.equal(typeof p.src, "string");
      assert.ok(isStr(p.alt), "alt");
      if (p.src) assert.ok(fs.existsSync(path.join("public", p.src)), `${p.src} exists`);
    }
  });

  test(`contact/${locale}`, () => {
    const c = read(`contact/${locale}.json`);
    for (const k of ["mailLabel", "email", "githubLabel", "githubUrl", "cvLabel", "cvUrl", "footer"]) assert.ok(isStr(c[k]), k);
    assert.ok(fs.existsSync(path.join("public", c.cvUrl)), "cv exists");
  });

  for (const slug of projectSlugs()) {
    test(`projects/${slug}/${locale}`, () => {
      const p = read(`projects/${slug}/${locale}.json`);
      for (const k of ["title", "org", "duration", "role", "summary"]) assert.ok(isStr(p[k]), k);
      assert.ok(COLOURS.includes(p.colour), "colour");
      assert.ok(DEMO_MODES.includes(p.demo?.mode), "demo.mode");
      if (p.demo.mode === "embed") assert.ok(isStr(p.demo.url), "embed needs url");
      if (p.demo.poster) assert.ok(fs.existsSync(path.join("public", p.demo.poster)), "poster exists");
      assert.ok(Array.isArray(p.links), "links");
      for (const l of p.links) assert.ok(isStr(l.label) && isStr(l.url), "link");
      assert.ok(Array.isArray(p.facts) && p.facts.length >= 2 && p.facts.length % 2 === 0, "facts: even count so the 2-col grid has no orphan cell");
      for (const f of p.facts) assert.ok(isStr(f.label) && isStr(f.value), "fact");
      if (p.guide) assert.ok(isStr(p.guide.heading) && strArray(p.guide.steps) && p.guide.steps.length >= 3, "guide");
      assert.ok(Array.isArray(p.sections) && p.sections.length >= 2, "sections");
      for (const s of p.sections) {
        assert.ok(isStr(s.heading) && strArray(s.paragraphs), s.heading);
        if (s.bullets) assert.ok(strArray(s.bullets));
        if (s.quote) assert.ok(isStr(s.quote));
      }
      assert.ok(strArray(p.tags) && p.tags.length > 0, "tags");
    });
  }
}
```

- [ ] **Step 2: Add the script**

In `package.json` `"scripts"` add `"test": "node --test \"tests/**/*.test.mjs\""` after `"lint"`.

- [ ] **Step 3: Run it, expect failure**

Run: `npm test`
Expected: several failures such as `ENOENT ... content/work/en.json` and `projects/neochain/en: colour`. That is the red state; content is created in Tasks 3 and 6.

- [ ] **Step 4: Commit**

```bash
git add tests/content.test.mjs package.json
git commit -m "test: add content schema validator for v2 content files

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Tokens, fonts, proxy

**Files:**
- Modify: `app/globals.css` (replace whole file)
- Modify: `app/[locale]/layout.tsx` (replace whole file)
- Create: `proxy.ts`; Delete: `middleware.ts`
- Create: `lib/projects.ts`

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

/* === Design tokens: paper + ink, colour belongs to projects === */
:root {
  --paper: #fcfbf7;
  --ink: #1e1c19;
  --fill: #f0eee6;
  --proj-towngas: #1f57d6;
  --proj-cathay: #0e8f7e;
  --proj-neochain: #e0a020;
  --proj-igc: #7b4bc4;
}

@theme inline {
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-fill: var(--fill);
  --color-towngas: var(--proj-towngas);
  --color-cathay: var(--proj-cathay);
  --color-neochain: var(--proj-neochain);
  --color-igc: var(--proj-igc);
  --font-mono: var(--font-geist-mono), ui-monospace, Menlo, monospace;
  --font-serif: var(--font-instrument), var(--font-noto-serif), Georgia, serif;
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-mono);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection { background: var(--ink); color: var(--paper); }

/* Diagonal hatch used wherever an image is not yet available */
.hatch {
  background-color: var(--fill);
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0 10px,
    color-mix(in srgb, var(--ink) 10%, transparent) 10px 11px
  );
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 2: Create `lib/projects.ts`**

```ts
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
  };
  links: { label: string; url: string }[];
  facts: { label: string; value: string }[];
  guide?: { heading: string; steps: string[] };
  sections: ProjectSection[];
  tags: string[];
};
```

- [ ] **Step 3: Replace `app/[locale]/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import TopBar from "@/app/components/TopBar";
import "../globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Alex Bao",
  description:
    "Alex (Zijun) Bao — HKU engineering student who turns operational pain points into deployed systems. Portfolio: insurance, fleet and meeting-minutes tools, a 747-8F load planner, NeoChain WMS.",
  keywords: ["Alex Bao", "Zijun Bao", "HKU", "operations", "AI tooling", "portfolio"],
};

export const viewport: Viewport = {
  themeColor: "#fcfbf7",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "zh")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${instrument.variable} ${geistMono.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <NextIntlClientProvider messages={messages}>
          <TopBar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Rename middleware to proxy**

Create `proxy.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

Then: `git rm middleware.ts`

- [ ] **Step 5: Delete the old Geist local font files and the unused MDX deps**

```bash
git rm -r app/fonts
npm uninstall @mdx-js/loader @mdx-js/react @next/mdx gray-matter reading-time
```

Edit `next.config.ts` to remove the `pageExtensions` line so it reads:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Typecheck (expect only "TopBar not found")**

Run: `npx tsc --noEmit 2>&1 | head`
Expected: one error, `Cannot find module '@/app/components/TopBar'`. Everything else compiles. Old pages still reference `SectionContainer` etc., which still exist until Task 4.

- [ ] **Step 7: Commit**

```bash
git add app lib proxy.ts next.config.ts package.json package-lock.json
git commit -m "feat(v2): paper/ink tokens, Instrument Serif + Geist Mono, proxy.ts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Home content files

**Files:**
- Create: `content/home/en.json` (replace), `content/work/en.json`, `content/skills/en.json`, `content/about/en.json` (replace), `content/contact/en.json` (replace), and the `zh.json` twin of each
- Delete: `content/blog/`, `content/projects/_index/`
- Modify: `messages/en.json`, `messages/zh.json` (replace)
- Copy: `~/Desktop/Bao_Zijun_HKU_CV.pdf` → `public/cv.pdf`

- [ ] **Step 1: `content/home/en.json`**

```json
{
  "availability": "available jan – sep 2027 for internships",
  "lead": "i'm alex —",
  "identities": [
    "an engineering student at HKU",
    "builder of operations tools",
    "photographer",
    "[TO FILL: two more identities, e.g. hiker / film watcher]"
  ],
  "closing": "and currently an industrial trainee at Towngas."
}
```

- [ ] **Step 2: `content/work/en.json`**

```json
{
  "title": "work",
  "subtitle": "internships / ventures / hackathons",
  "cards": [
    { "slug": "insurance-program", "title": "Insurance Programme", "org": "Towngas", "duration": "Jun – Dec 2026", "role": "Dashboards + RAG agent", "kind": "Internship", "colour": "towngas", "cover": "/projects/insurance-program/cover.png" },
    { "slug": "vehicle-parking", "title": "Fleet Management", "org": "Towngas", "duration": "Jun – Dec 2026", "role": "Change requests + approvals", "kind": "Internship", "colour": "towngas", "cover": "/projects/vehicle-parking/cover.png" },
    { "slug": "meeting-minutes", "title": "Meeting Minutes Workbench", "org": "Towngas", "duration": "Jun – Dec 2026", "role": "LLM workflow → Word", "kind": "Internship", "colour": "towngas", "cover": "/projects/meeting-minutes/cover.png" },
    { "slug": "cathay-hackathon", "title": "747-8F Load Planner", "org": "Cathay Hackathon 2025", "duration": "Sep – Nov 2025", "role": "Team lead / MILP in the browser", "kind": "Hackathon", "colour": "cathay", "cover": "/projects/cathay-hackathon/cover.png" },
    { "slug": "neochain", "title": "NeoChain WMS", "org": "NeoChain Co.", "duration": "Jul 2025 – Jun 2026", "role": "PRD, architecture, on-site pilot", "kind": "Co-founder", "colour": "neochain" },
    { "slug": "igc", "title": "BuildingOS Digital Twin", "org": "Intelli Global Corporation", "duration": "Jun – Aug 2025", "role": "PRDs + RAG knowledge bases", "kind": "Internship", "colour": "igc" }
  ]
}
```

- [ ] **Step 3: `content/skills/en.json`**

```json
{
  "title": "skills",
  "subtitle": "in order of relevance / proficiency",
  "groups": [
    { "name": "Methods", "items": ["Data-Driven Optimization", "MILP / Operations Research", "System Simulation", "PRD Writing", "Process Mapping", "RAG Pipeline Design", "Prompt Engineering"] },
    { "name": "Tools", "items": ["Claude Code", "Lark (Feishu) / Spark", "Excel", "Power BI", "Power Automate", "Power Apps", "SAP", "FlexSim", "Figma", "Vercel"] },
    { "name": "Technical", "items": ["Python", "SQL", "TypeScript", "React / Next.js", "Tailwind CSS", "Node.js", "Git"] }
  ],
  "languagesLabel": "Languages",
  "languages": "English (professional working) · Mandarin (native) · Cantonese (limited working)"
}
```

- [ ] **Step 4: `content/about/en.json`**

```json
{
  "title": "about",
  "subtitle": "a little bit more about me :)",
  "paragraphs": [
    "I study Data and Systems Engineering at the University of Hong Kong and spend most of my time turning operational pain points into software that survives contact with real users: a warehouse system piloted on a factory floor, an insurance database that replaced fourteen years of PDFs, a load planner that solves an integer programme in your browser. [TO FILL: where you grew up, how long in Hong Kong, what you do outside work, one detail with a picture in it.]"
  ],
  "photosIntro": "when i'm not at a desk i'm usually behind a camera — a few frames:",
  "photos": [
    { "src": "", "alt": "placeholder — photo 1" },
    { "src": "", "alt": "placeholder — photo 2" },
    { "src": "", "alt": "placeholder — photo 3" },
    { "src": "", "alt": "placeholder — photo 4" },
    { "src": "", "alt": "placeholder — photo 5" },
    { "src": "", "alt": "placeholder — photo 6" }
  ]
}
```

- [ ] **Step 5: `content/contact/en.json`**

```json
{
  "mailLabel": "say hi →",
  "email": "zijun.bao@outlook.com",
  "githubLabel": "github ↗",
  "githubUrl": "https://github.com/AlexBao1218",
  "cvLabel": "resume (pdf) ↓",
  "cvUrl": "/cv.pdf",
  "footer": "© 2026 alex bao · built with next.js, set in instrument serif + geist mono"
}
```

- [ ] **Step 6: Chinese twins**

Until zh copy is written, the zh files are byte copies of the en files so `/zh` renders and the validator passes. Run:

```bash
for s in home work skills about contact; do cp content/$s/en.json content/$s/zh.json; done
git rm -r content/blog content/projects/_index
cp ~/Desktop/Bao_Zijun_HKU_CV.pdf public/cv.pdf
```

- [ ] **Step 7: Replace `messages/en.json`**

```json
{
  "nav": { "work": "work", "skills": "skills", "about": "about", "resume": "resume" },
  "project": {
    "back": "← back to work",
    "openDemo": "open live demo ↗",
    "activate": "click to interact",
    "mobileNote": "The live demo is built for a desktop screen — open it in a new tab.",
    "recordingNote": "Recording coming soon — open the demo to try the full flow.",
    "guideFallback": "how to try it",
    "stack": "stack"
  }
}
```

- [ ] **Step 8: Replace `messages/zh.json`**

```json
{
  "nav": { "work": "作品", "skills": "技能", "about": "关于", "resume": "简历" },
  "project": {
    "back": "← 返回作品",
    "openDemo": "打开在线 demo ↗",
    "activate": "点击开始操作",
    "mobileNote": "在线 demo 为桌面屏幕设计，请在新标签页打开。",
    "recordingNote": "录屏即将上线，可先打开 demo 体验完整流程。",
    "guideFallback": "怎么试用",
    "stack": "技术栈"
  }
}
```

- [ ] **Step 9: Run validator (home sections green, projects still red)**

Run: `npm test 2>&1 | grep -E "^(ok|not ok)"`
Expected: `ok` for `home/*`, `skills/*`, `about/*`, `contact/*`. Still `not ok`: `work/*` (cover PNGs arrive in Task 8, and project JSON for the three new slugs arrives in Task 6) and `projects/*` (old schema). Nothing else may fail.

- [ ] **Step 10: Commit**

```bash
git add -A content messages public/cv.pdf
git commit -m "content(v2): home, work, skills, about, contact; new CV; nav strings

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Remove old routes and components

**Files:**
- Delete: `app/[locale]/about/`, `app/[locale]/blog/`, `app/[locale]/contact/`, `app/[locale]/projects/page.tsx`, `app/[locale]/projects/CLAUDE.md`, `app/components/Navigation.tsx`, `app/components/PageHeader.tsx`, `app/components/SectionContainer.tsx`, `app/components/TagList.tsx`

- [ ] **Step 1: Delete**

```bash
git rm -r "app/[locale]/about" "app/[locale]/blog" "app/[locale]/contact" "app/[locale]/projects/page.tsx" "app/[locale]/projects/CLAUDE.md"
git rm app/components/Navigation.tsx app/components/PageHeader.tsx app/components/SectionContainer.tsx app/components/TagList.tsx
```

- [ ] **Step 2: Confirm nothing else imports them**

Run: `grep -rn "SectionContainer\|PageHeader\|TagList\|Navigation" app lib --include=*.tsx --include=*.ts`
Expected: only `app/[locale]/page.tsx` and `app/[locale]/projects/[slug]/page.tsx` (both rewritten in Tasks 5 and 7).

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(v2): remove multi-page routes and old shared components

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Shared components and home page

**Files:**
- Create: `app/components/TopBar.tsx`, `app/components/OffsetBox.tsx`, `app/components/SectionStarter.tsx`
- Create: `app/components/home/Hero.tsx`, `WorkGrid.tsx`, `WorkCard.tsx`, `SkillsSection.tsx`, `AboutSection.tsx`, `PhotoRow.tsx`, `ContactSection.tsx`
- Modify: `app/[locale]/page.tsx` (replace)

- [ ] **Step 1: `app/components/OffsetBox.tsx`**

```tsx
type Props = {
  /** Tailwind background class for the block behind the face, e.g. "bg-towngas" or "bg-ink". */
  blockClass: string;
  children: React.ReactNode;
  className?: string;
  /** Offset in px; face slides to 0 on hover. */
  offset?: 8 | 12;
};

export default function OffsetBox({ blockClass, children, className = "", offset = 12 }: Props) {
  const off = offset === 8 ? "top-2 left-2 mr-2 mb-2" : "top-3 left-3 mr-3 mb-3";
  return (
    <div className={`${blockClass} ${className}`}>
      <div
        className={`relative ${off} border border-ink bg-paper transition-[top,left] duration-300 ease-in-out hover:top-0 hover:left-0 focus-within:top-0 focus-within:left-0`}
      >
        {children}
      </div>
    </div>
  );
}
```

Note: `mr-*`/`mb-*` on the face keeps the block's box the same size as the face's resting footprint, so the block never pokes out on the far side.

- [ ] **Step 2: `app/components/SectionStarter.tsx`**

```tsx
type Props = { id: string; title: string; subtitle: string };

export default function SectionStarter({ id, title, subtitle }: Props) {
  return (
    <div
      id={id}
      className="scroll-mt-14 md:scroll-mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-y border-ink px-5 md:px-10 py-4"
    >
      <h2 className="font-serif text-3xl md:text-4xl leading-none">{title}</h2>
      <p className="text-[12px] md:text-[13px] text-ink/70">{subtitle}</p>
    </div>
  );
}
```

- [ ] **Step 3: `app/components/TopBar.tsx`**

```tsx
"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function TopBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useParams().locale as string;

  const anchors = [
    { hash: "work", label: t("work") },
    { hash: "skills", label: t("skills") },
    { hash: "about", label: t("about") },
  ];

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "zh" : "en" });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper border-b border-ink">
      <div className="flex items-center justify-between gap-3 px-5 md:px-10 h-14 md:h-16">
        <Link href="/" className="font-serif text-xl md:text-[28px] leading-none whitespace-nowrap">
          alex bao
        </Link>
        <nav aria-label="Sections" className="flex items-center gap-3 md:gap-7 text-[13px]">
          {anchors.map((a) => (
            <Link
              key={a.hash}
              href={{ pathname: "/", hash: a.hash }}
              className="underline decoration-1 underline-offset-4 hover:decoration-2"
            >
              {a.label}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {t("resume")}
          </a>
          <button
            type="button"
            onClick={toggleLocale}
            className="border border-ink px-2 py-0.5 text-[12px] hover:bg-fill focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
            aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: `app/components/home/Hero.tsx`**

```tsx
import { loadContent } from "@/lib/content";

type HomeContent = { availability: string; lead: string; identities: string[]; closing: string };

export default async function Hero({ locale }: { locale: string }) {
  const c = await loadContent<HomeContent>("home", locale);
  const list = c.identities.join(", ");

  return (
    <section className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 md:gap-16 items-center px-5 md:px-10 pt-28 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-[60ch]">
        <p className="text-[11px] md:text-[12px] tracking-[0.14em] uppercase mb-5">{c.availability}</p>
        <p className="text-[15px] md:text-[17px] leading-relaxed">
          <span className="font-serif italic text-[1.35em] leading-none">{c.lead}</span>{" "}
          {list}, {c.closing}
        </p>
      </div>
      {/* Intro image slot — intentionally empty until Alex picks an image. */}
      <div aria-hidden="true" className="hidden md:block hatch border border-ink aspect-[4/5] max-w-[280px] justify-self-end" />
    </section>
  );
}
```

- [ ] **Step 5: `app/components/home/WorkCard.tsx`**

```tsx
import Image from "next/image";
import { Link } from "@/i18n/routing";
import OffsetBox from "@/app/components/OffsetBox";
import { BG_CLASS, type WorkCardData } from "@/lib/projects";

export default function WorkCard({ card }: { card: WorkCardData }) {
  return (
    <OffsetBox blockClass={BG_CLASS[card.colour]}>
      <Link href={`/projects/${card.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink">
        <div className="px-3 py-2.5 border-b border-ink text-[12px]">{card.duration}</div>
        <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
          {card.cover ? (
            <Image src={card.cover} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" className="object-cover object-top" />
          ) : (
            <div className="hatch absolute inset-0" />
          )}
        </div>
        <h3 className="px-3 py-2.5 border-b border-ink font-serif text-[22px] leading-tight">{card.title}</h3>
        <div className="px-3 py-2.5 border-b border-ink text-[12px]">{card.org}</div>
        <div className="px-3 py-2.5 text-[12px] text-ink/70">
          {card.kind} / {card.role}
        </div>
      </Link>
    </OffsetBox>
  );
}
```

- [ ] **Step 6: `app/components/home/WorkGrid.tsx`**

```tsx
import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import WorkCard from "./WorkCard";
import type { WorkCardData } from "@/lib/projects";

type WorkContent = { title: string; subtitle: string; cards: WorkCardData[] };

export default async function WorkGrid({ locale }: { locale: string }) {
  const c = await loadContent<WorkContent>("work", locale);
  return (
    <section>
      <SectionStarter id="work" title={c.title} subtitle={c.subtitle} />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto">
        {c.cards.map((card) => (
          <li key={card.slug}>
            <WorkCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 7: `app/components/home/SkillsSection.tsx`**

```tsx
import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";

type SkillsContent = {
  title: string;
  subtitle: string;
  groups: { name: string; items: string[] }[];
  languagesLabel: string;
  languages: string;
};

export default async function SkillsSection({ locale }: { locale: string }) {
  const c = await loadContent<SkillsContent>("skills", locale);
  return (
    <section>
      <SectionStarter id="skills" title={c.title} subtitle={c.subtitle} />
      <div className="px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto grid gap-10">
        {c.groups.map((g) => (
          <div key={g.name} className="grid md:grid-cols-[160px_minmax(0,1fr)] gap-3 md:gap-8 items-start">
            <h3 className="text-[11px] tracking-[0.14em] uppercase text-ink/60 pt-2">{g.name}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <li key={item} className="border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="grid md:grid-cols-[160px_minmax(0,1fr)] gap-3 md:gap-8 items-baseline border-t border-ink pt-6">
          <h3 className="text-[11px] tracking-[0.14em] uppercase text-ink/60">{c.languagesLabel}</h3>
          <p className="text-[13px]">{c.languages}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: `app/components/home/PhotoRow.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { src: string; alt: string };

export default function PhotoRow({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = open !== null ? photos[open] : null;

  return (
    <>
      <ul className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-6 md:overflow-visible">
        {photos.map((p, i) => (
          <li key={`${p.src}-${i}`} className="shrink-0 w-36 md:w-auto">
            <button
              type="button"
              onClick={() => p.src && setOpen(i)}
              disabled={!p.src}
              aria-label={p.alt}
              className="relative block w-full aspect-[4/5] border border-ink overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-default"
            >
              {p.src ? (
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 16vw, 144px" className="object-cover" />
              ) : (
                <span className="hatch absolute inset-0" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-6"
          onClick={() => setOpen(null)}
        >
          <div className="relative w-full max-w-4xl aspect-[3/2]">
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-5 text-paper text-[13px] underline underline-offset-4"
          >
            close
          </button>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 9: `app/components/home/AboutSection.tsx`**

```tsx
import { loadContent } from "@/lib/content";
import SectionStarter from "@/app/components/SectionStarter";
import PhotoRow from "./PhotoRow";

type AboutContent = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  photosIntro: string;
  photos: { src: string; alt: string }[];
};

export default async function AboutSection({ locale }: { locale: string }) {
  const c = await loadContent<AboutContent>("about", locale);
  return (
    <section>
      <SectionStarter id="about" title={c.title} subtitle={c.subtitle} />
      <div className="px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto grid gap-10">
        <div className="max-w-[68ch] grid gap-5 text-[14px] md:text-[15px] leading-relaxed">
          {c.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="text-[13px] text-ink/70">{c.photosIntro}</p>
        <PhotoRow photos={c.photos} />
      </div>
    </section>
  );
}
```

- [ ] **Step 10: `app/components/home/ContactSection.tsx`**

```tsx
import { loadContent } from "@/lib/content";
import OffsetBox from "@/app/components/OffsetBox";

type ContactContent = {
  mailLabel: string;
  email: string;
  githubLabel: string;
  githubUrl: string;
  cvLabel: string;
  cvUrl: string;
  footer: string;
};

export default async function ContactSection({ locale }: { locale: string }) {
  const c = await loadContent<ContactContent>("contact", locale);
  return (
    <footer className="border-t border-ink">
      <div className="px-5 md:px-10 py-12 md:py-16 max-w-6xl mx-auto flex flex-wrap items-center gap-x-8 gap-y-6">
        <OffsetBox blockClass="bg-ink" offset={8} className="inline-block">
          <a href={`mailto:${c.email}`} className="block bg-fill px-4 py-2.5 text-[13px] font-medium">
            {c.mailLabel} {c.email}
          </a>
        </OffsetBox>
        <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] underline decoration-1 underline-offset-4 hover:decoration-2">
          {c.githubLabel}
        </a>
        <a href={c.cvUrl} download className="text-[13px] underline decoration-1 underline-offset-4 hover:decoration-2">
          {c.cvLabel}
        </a>
      </div>
      <p className="px-5 md:px-10 pb-8 text-[11px] text-ink/60 max-w-6xl mx-auto">{c.footer}</p>
    </footer>
  );
}
```

- [ ] **Step 11: Replace `app/[locale]/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import Hero from "@/app/components/home/Hero";
import WorkGrid from "@/app/components/home/WorkGrid";
import SkillsSection from "@/app/components/home/SkillsSection";
import AboutSection from "@/app/components/home/AboutSection";
import ContactSection from "@/app/components/home/ContactSection";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero locale={locale} />
      <WorkGrid locale={locale} />
      <SkillsSection locale={locale} />
      <AboutSection locale={locale} />
      <ContactSection locale={locale} />
    </main>
  );
}
```

- [ ] **Step 12: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: tsc errors only from `app/[locale]/projects/[slug]/page.tsx` (still old imports; fixed in Task 7). Lint clean apart from that file.

- [ ] **Step 13: Run the dev server and look**

Use the Browser pane: `preview_start` with a `.claude/launch.json` entry `{ "name": "web", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 }`, open `http://localhost:3000/en`. Check: fixed bordered top bar; hero sentence with italic serif lead; six cards in a 3-column grid with coloured offset blocks (three blue, one teal, one amber, one violet); hover slides a card onto its block; skills tags boxed; about paragraph + six hatch squares; footer mail button. Resize to 375 px: cards stack, photo row scrolls sideways, no horizontal page scroll.

- [ ] **Step 14: Commit**

```bash
git add -A app .claude/launch.json
git commit -m "feat(v2): single-page home — top bar, hero, work grid, skills, about, contact

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Project content (six files + zh twins)

**Files:**
- Create: `content/projects/insurance-program/en.json`, `vehicle-parking/en.json`, `meeting-minutes/en.json`
- Replace: `content/projects/cathay-hackathon/en.json`, `neochain/en.json`, `igc/en.json`
- Copy each to `zh.json`

- [ ] **Step 1: `content/projects/insurance-program/en.json`**

```json
{
  "title": "Insurance Programme",
  "org": "Towngas · Corporate Supplies & Administration",
  "duration": "Jun – Dec 2026",
  "role": "Industrial trainee — sole builder",
  "colour": "towngas",
  "summary": "Fourteen years of corporate insurance records — 34 classes of cover, 201 policies, 767 claims — lived in a broker workbook, three claims ledgers and folders of PDFs. I digitised them into a policy-linked database with dashboards, trend and loss-ratio views, and a RAG agent that answers questions in chat.",
  "demo": { "mode": "embed", "url": "https://insurance-demo.zijun.cloud", "height": 720, "poster": "/projects/insurance-program/cover.png" },
  "links": [
    { "label": "open live demo ↗", "url": "https://insurance-demo.zijun.cloud" },
    { "label": "source on github ↗", "url": "https://github.com/AlexBao1218/insurance-program-demo" }
  ],
  "facts": [
    { "label": "Timeline", "value": "Jun – Dec 2026" },
    { "label": "Role", "value": "PRD, data model, frontend, backend, AI integration" },
    { "label": "Stack", "value": "React 19 · TypeScript · Vite · Tailwind · shadcn/ui · ECharts · NestJS · Feishu Bitable / Spark / Aily" },
    { "label": "Public demo", "value": "Same code on synthetic aggregates; record-level fields redacted; AI panel simulated" }
  ],
  "guide": {
    "heading": "how to try it (2 minutes)",
    "steps": [
      "Start on the Dashboard: annual premium, trend and loss ratio for the whole programme. The \"Synthetic data\" badge means the numbers are generated, not the company's.",
      "Open Classes and page through the 34 classes of cover. Click one to see its policy chain — note how back-to-back 18-month policies contribute exactly one year of premium to each year.",
      "Open Claims: every record-level field (policy number, insurer, claimant) is a grey \"Redacted for public demo\" bar — the layout is real, the values are withheld.",
      "Open Assistant and send any message. This panel is a visual replica of the Aily agent and answers with an explicit \"not available in public demo\" notice rather than a made-up reply.",
      "Open Reports and generate the narrative — the section structure, the re-inserted live charts and the Word / Markdown export are the real pipeline on canned text."
    ]
  },
  "sections": [
    {
      "heading": "The problem",
      "paragraphs": [
        "A simple question such as \"what did we pay for property cover in 2021 and what came back in claims?\" took hours of manual arithmetic across a broker's Excel, three claims ledgers and PDFs. Nobody could see a loss ratio by class or by year without rebuilding the numbers by hand."
      ]
    },
    {
      "heading": "What I built",
      "paragraphs": [
        "A Feishu Spark app that reads three Bitable tables through the platform's capabilities, joins them in the browser, caches with schema and version guards, and computes premium, trend and loss-ratio views with a pro-rata monthly rule that handles 18-month policy chains without double counting.",
        "An Aily agent answers questions in chat. For reports, a server-side proxy calls one Aily skill per section with a pinned output structure, the client re-inserts live dashboard charts into the model's Markdown, and the result exports to Word with embedded figures, PDF or a Feishu Doc."
      ],
      "bullets": [
        "Pro-rata monthly attribution of annualised premium to policy years",
        "Tolerant extractors for every Bitable value shape; loader falls back to a bundled dataset so every page renders outside Feishu",
        "AI report generation that stays honest: full class names beside every code, an IBNR caveat on immature years"
      ],
      "quote": "Digitized 14 years of insurance records into a policy-linked database with dashboards and a RAG agent."
    },
    {
      "heading": "Outcome",
      "paragraphs": [
        "[TO FILL: hours saved per query / who uses it weekly / one sentence from the department on what changed.]"
      ]
    },
    {
      "heading": "What the public demo withholds",
      "paragraphs": [
        "The employer is not named. Aggregates are synthetic and badged as such; claim counts, loss ratios, per-layer shares, day-level dates and broker names are withheld; charts keep axes without numeric values; record-level fields render as explicit \"Redacted\" bars. Nothing is replaced with an invented stand-in."
      ]
    }
  ],
  "tags": ["React 19", "TypeScript", "NestJS", "ECharts", "Feishu Spark", "Feishu Aily", "RAG", "docx"]
}
```

- [ ] **Step 2: `content/projects/vehicle-parking/en.json`**

```json
{
  "title": "Fleet Management",
  "org": "Towngas · Transport team",
  "duration": "Jun – Dec 2026",
  "role": "Industrial trainee — sole builder",
  "colour": "towngas",
  "summary": "Vehicle changes used to arrive by email, get typed into a draft table, then re-typed into an Excel master so a macro could produce the logbook. I built a fleet workspace with plate and parking-site lookup, a change-request cart, and an admin console that approves requests and writes the new value back to the fleet record on its effective date.",
  "demo": { "mode": "embed", "url": "https://fleet-demo.zijun.cloud", "height": 720, "poster": "/projects/vehicle-parking/cover.png" },
  "links": [
    { "label": "open live demo ↗", "url": "https://fleet-demo.zijun.cloud" },
    { "label": "source on github ↗", "url": "https://github.com/AlexBao1218/vehicle-parking-demo" }
  ],
  "facts": [
    { "label": "Timeline", "value": "Jun – Dec 2026" },
    { "label": "Role", "value": "Process mapping, data model, frontend, backend, rollout" },
    { "label": "Stack", "value": "React 19 · TypeScript · Vite · Tailwind · shadcn/ui · NestJS · PostgreSQL · Drizzle · Feishu Bitable / Spark" },
    { "label": "Public demo", "value": "Synthetic fleet (DEMO 101–136), in-browser backend, identity fields redacted" }
  ],
  "guide": {
    "heading": "how to try it (2 minutes)",
    "steps": [
      "The demo opens on vehicle DEMO 101. Search another plate, or switch to a parking site to see its live floor plan with plates on their bays.",
      "Add a change to the cart — pick a change type and watch the form adapt to it (a new parking bay asks different questions than a driver reassignment).",
      "Submit the cart, then open the Admin console and approve it. The approval writes a logbook row, gates the fleet-record write-back on the effective date and reads it back to verify.",
      "Open After Approval: copy the logbook rows as six-column TSV in the Excel macro's order, and see the follow-up queue for approved changes that still need offline action.",
      "Use Reset data in the banner to start over — everything lives in your browser's localStorage."
    ]
  },
  "sections": [
    {
      "heading": "The problem",
      "paragraphs": [
        "Three copies of every change (email, draft table, Excel master) meant three chances to mistype a plate, and the logbook macro only worked if the columns were in exactly the right order. Rules about which changes touch the logbook and which touch the fleet record lived in five places across client and server."
      ]
    },
    {
      "heading": "What I built",
      "paragraphs": [
        "One registry of change types, guarded by module-load invariants, decides what every approval does. Approval is a transaction: logbook row, effective-date-gated write-back, read-back verification, plate-based record-id re-resolution, and a status bar plus drawer for changes whose date has arrived but are not yet written.",
        "The after-approval workspace meets the team where it is: TSV copy in the macro's column order, test-row marking during rollout, and a follow-up queue for approved requests that need offline action."
      ],
      "bullets": [
        "Change-type registry: two booleans (writes the logbook? writes the fleet record?) replace five scattered copies of the rules",
        "Per-site floor plans with live bay assignment",
        "Rollout with test rows so the team could dry-run without touching the master"
      ],
      "quote": "Built a fleet management app with change requests and admin approval, replacing manual logbook entry."
    },
    {
      "heading": "Alongside it: fleet utilisation from GPS",
      "paragraphs": [
        "In the same internship I turned raw GPS pings from 548 vehicles into a quarterly utilisation index in Python, which now guides fleet allocation. That analysis (geofences, dwell time, idle detection) will get its own page with diagrams later."
      ]
    },
    {
      "heading": "Outcome",
      "paragraphs": [
        "[TO FILL: number of requests processed in the pilot / re-typing steps removed / one line from the transport team.]"
      ]
    }
  ],
  "tags": ["React 19", "TypeScript", "NestJS", "PostgreSQL", "Drizzle", "Feishu Spark", "Process design"]
}
```

- [ ] **Step 3: `content/projects/meeting-minutes/en.json`**

```json
{
  "title": "Meeting Minutes Workbench",
  "org": "Towngas · Safety committee",
  "duration": "Jun – Dec 2026",
  "role": "Industrial trainee — sole builder",
  "colour": "towngas",
  "summary": "A secretary typed up Cantonese safety-committee meetings into a strict, years-old Word format. I chained an LLM agent and a two-page workbench so a transcript becomes a validated seven-section JSON, then a .docx cloned from the department template — two hours of work down to about a minute.",
  "demo": { "mode": "recording", "url": "https://minutes-demo.zijun.cloud", "poster": "/projects/meeting-minutes/cover.png" },
  "links": [
    { "label": "open live demo ↗", "url": "https://minutes-demo.zijun.cloud" },
    { "label": "source on github ↗", "url": "https://github.com/AlexBao1218/meeting-minutes-demo" }
  ],
  "facts": [
    { "label": "Timeline", "value": "Jun – Dec 2026" },
    { "label": "Role", "value": "Prompt design, JSON contract, validator, docx generator, UI" },
    { "label": "Stack", "value": "React 19 · TypeScript · Vite · Tailwind · shadcn/ui · NestJS · jszip · xmldom · Feishu Spark / Aily" },
    { "label": "Public demo", "value": "Backend dropped; docx builder runs in the browser on a template whose every value is withheld; AI panel simulated" }
  ],
  "guide": {
    "heading": "what the recording shows",
    "steps": [
      "Load the sample JSON — the seven fixed sections the Aily agent produces from a transcript, with unclear lines marked \"uncertain\" instead of guessed.",
      "Break the JSON on purpose: the validator reports the first offending character with line, column and a plain-language reason, even when the engine's parse error has no position.",
      "Watch the preview: sections render in order, uncertain lines are highlighted amber, and the meeting number is deliberately left as X for the secretary to confirm.",
      "Generate the .docx — donor rows are cloned from the template so fonts, borders and numbering never drift from the original."
    ]
  },
  "sections": [
    {
      "heading": "The problem",
      "paragraphs": [
        "The minutes format was strict and old: numbered sections, specific fonts, a table layout nobody wanted to rebuild. Typing a 90-minute Cantonese meeting into it took about two hours, and anything misheard became a fact once it was in the document."
      ]
    },
    {
      "heading": "What I built",
      "paragraphs": [
        "An Aily agent turns the transcript into a fixed seven-section JSON. The workbench validates it on every keystroke with line-and-column error recovery, previews the structure with amber review prompts, and generates the Word file by cloning formatted donor rows from the department template — no styles are redefined, so the output is indistinguishable from a hand-typed one."
      ],
      "bullets": [
        "Word generation by donor-row cloning: only text nodes are swapped",
        "A 150-line hand-written JSON scanner for error positions the engine omits",
        "Honest uncertainty: 【待確認】 wraps every flagged line in the output"
      ],
      "quote": "Chained LLMs into a workflow drafting formatted meeting minutes, cutting 2 hours of work to 1 minute."
    },
    {
      "heading": "Outcome",
      "paragraphs": [
        "[TO FILL: meetings processed so far / secretary's feedback / whether other committees picked it up.]"
      ]
    }
  ],
  "tags": ["LLM workflow", "React 19", "TypeScript", "docx", "jszip", "Feishu Aily", "Cantonese"]
}
```

- [ ] **Step 4: Replace `content/projects/cathay-hackathon/en.json`**

```json
{
  "title": "747-8F Load Planner",
  "org": "Cathay Hackathon 2025 · Top 50 finalist of 1,500+ teams",
  "duration": "Sep – Nov 2025 · rebuilt 2026",
  "role": "Team lead",
  "colour": "cathay",
  "summary": "Where the containers go on a freighter decides where its centre of gravity sits, and CG drives fuel burn. In the 24-hour final at Cathay City we built a drag-and-drop ULD planner backed by a MILP. The 2026 rebuild runs that solver as WebAssembly in your browser, with weight limits, type compatibility, lateral balance and lockable positions.",
  "demo": { "mode": "embed", "url": "https://cargo-demo.zijun.cloud", "height": 760, "poster": "/projects/cathay-hackathon/cover.png" },
  "links": [
    { "label": "open live demo ↗", "url": "https://cargo-demo.zijun.cloud" },
    { "label": "rebuild source ↗", "url": "https://github.com/AlexBao1218/cargo-load-demo" },
    { "label": "original hackathon repo ↗", "url": "https://github.com/AlexBao1218/cxhack25" }
  ],
  "facts": [
    { "label": "Timeline", "value": "Sep – Nov 2025 (hackathon) · 2026 (rebuild)" },
    { "label": "Role", "value": "Team lead — MILP research, interface, pitch" },
    { "label": "Stack", "value": "Vite · React 19 · TypeScript · Tailwind v4 · zustand · dnd-kit · GLPK 5 via glpk.js (wasm, Web Worker)" },
    { "label": "Data", "value": "Hackathon's synthetic scenarios, re-scaled to plausible freighter magnitudes — not airline data" }
  ],
  "guide": {
    "heading": "how to try it (2 minutes)",
    "steps": [
      "Pick a scenario at the top — Full (34 ULDs), Partial (24) or Light (16). The 747 is drawn nose-up on the left; unassigned ULDs wait on the right.",
      "Drag a ULD onto a position. Invalid targets (over the weight limit, wrong type for a nose position) are flagged before you drop; the CG gauge and score update live.",
      "Lock a position you want to keep, then press Solve. The MILP treats locked pairs as fixed and plans everything else around them — usually in under half a second.",
      "Open the How-it-works drawer to see the actual variables, constraints and objective, plus the size and time of the last solve."
    ]
  },
  "sections": [
    {
      "heading": "The problem",
      "paragraphs": [
        "The load planning we saw during the hackathon was surprisingly informal for a decision with that much money behind it. A planner needs to see the aircraft, move things by hand, and have a machine handle the arithmetic of where the rest should go so the CG lands on target."
      ]
    },
    {
      "heading": "What we built in 24 hours",
      "paragraphs": [
        "A 2D planner that plays like a packing game: top-down aircraft on the left, weighed cargo on the right, live CG bar on top. Behind it, a MILP from the load-planning literature — binary variables for \"this ULD in that position\", each ULD placed once, each position used at most once, objective minimising CG deviation from target."
      ],
      "quote": "Researched MILP algorithms to compute CG-balanced ULD layouts for a Boeing 747; Top 50 Finalist out of 1,500+ teams."
    },
    {
      "heading": "What the rebuild changed",
      "paragraphs": [
        "The hackathon model was smaller than the pitch implied — no weight limits, no lateral balance, no locks, and a bug that used lateral positions to compute longitudinal CG. The rebuild adds position weight limits, ULD-type compatibility, a lateral balance penalty and user locks, and shows the formulation on screen. The solver is GLPK compiled to WebAssembly in a Web Worker: nothing leaves the browser. A ±1 cm / ±200 kg dead zone was necessary for branch-and-bound to converge."
      ],
      "bullets": [
        "All three scenarios solve to optimal in 40–360 ms in the browser",
        "Lock / pin any position; the solver plans around it",
        "Sticky CG gauge with target band, 0–100 score, per-tile capacity bar"
      ]
    },
    {
      "heading": "What we learned",
      "paragraphs": [
        "Going off-prompt on the final day was a risky call made on the strength of our preliminary-round work; it cost hours of discussion and left us without a dedicated cargo judge for feedback. In a 24-hour hackathon, presentation prep has to happen during the build, not after it."
      ]
    }
  ],
  "tags": ["MILP", "GLPK", "WebAssembly", "Operations Research", "React 19", "dnd-kit", "Vibe Coding"]
}
```

- [ ] **Step 5: Replace `content/projects/neochain/en.json`**

```json
{
  "title": "NeoChain WMS",
  "org": "NeoChain Co., Limited — industrial digital-transformation consulting for manufacturing and logistics SMEs",
  "duration": "Jul 2025 – Jun 2026",
  "role": "Co-founder",
  "colour": "neochain",
  "summary": "On site at an auto-parts factory in Wenzhou we found no WMS in their ERP and inventory tracked on paper. I led a seven-person team to scope and build a PDA-based warehouse system MVP, authored the PRD and the full architecture, secured client funding for barcode hardware and ran an on-site pilot in production.",
  "demo": { "mode": "static" },
  "links": [
    { "label": "neochainhk.com ↗", "url": "https://neochainhk.com" }
  ],
  "facts": [
    { "label": "Timeline", "value": "Jul 2025 – Jun 2026" },
    { "label": "Role", "value": "Co-founder — PRD, system architecture, team lead of 7, client pilot" },
    { "label": "Stack", "value": "Next.js · TypeScript · XState · Python (optimisation) · PDA hardware · Vercel" },
    { "label": "Status", "value": "Pilot ran on the factory floor; [TO FILL: current status]" }
  ],
  "sections": [
    {
      "heading": "The problem",
      "paragraphs": [
        "Generic ERPs from the big Chinese vendors do not fit how a 50-person parts factory actually moves goods. Paper checklists meant data gaps, blind spots, no forecasting and no reorder optimisation. The gap was found on site, not in a pitch deck."
      ]
    },
    {
      "heading": "What we built",
      "paragraphs": [
        "A PDA-based WMS with seven modules — receiving, put-away, pick-up, line inbound, production closing, line packaging, sales outbound. Each workflow is a state machine: every step confirmed before the next, producing a complete audit trail. The UI is built for noisy floors, poor light and rushed handoffs: you cannot skip a step or misconfirm a package."
      ],
      "bullets": [
        "PRD and full architecture authored by me; each engineer owns one end-to-end module",
        "Client-funded barcode hardware; on-site pilot in production",
        "AI-assisted development process: plan-mode task decomposition, shared skills/SOPs, a memory of design decisions"
      ],
      "quote": "Led a 7-person team to scope and build a WMS MVP, authoring the PRD and full system architecture."
    },
    {
      "heading": "What I learned",
      "paragraphs": [
        "Splitting work by UI versus backend failed; everyone needed end-to-end understanding of a module. Once each person owned a complete module, integration friction dropped and code consistency rose."
      ]
    }
  ],
  "tags": ["WMS", "Next.js", "TypeScript", "State machines", "PDA", "Field research", "Team lead"]
}
```

- [ ] **Step 6: Replace `content/projects/igc/en.json`**

```json
{
  "title": "BuildingOS Digital Twin",
  "org": "Intelli Global Corporation (IGC) — smart building management platform",
  "duration": "Jun – Aug 2025",
  "role": "Product intern",
  "colour": "igc",
  "summary": "Product internship on BuildingOS, IGC's platform for property and facility operators. I authored PRDs for The Henderson's digital twin, classified 1,000+ building documents into six RAG knowledge bases, built the energy-saving model that proved the platform's ESG value for the HKICT Awards, and presented IoT proposals to the Hong Kong Housing Authority.",
  "demo": { "mode": "static" },
  "links": [],
  "facts": [
    { "label": "Timeline", "value": "Jun – Aug 2025" },
    { "label": "Role", "value": "Product intern — PRDs, API specs, RAG data pipeline, ESG model" },
    { "label": "Stack", "value": "Python · RAG agent platform · IoT / government data APIs · Excel modelling" },
    { "label": "Outputs", "value": "Digital-twin PRDs · 6 knowledge bases · ESG model · Housing Authority proposal" }
  ],
  "sections": [
    {
      "heading": "RAG knowledge bases",
      "paragraphs": [
        "Building maintenance needed a specialist engineer for even minor questions. I wrote Python scripts to scan 1,000+ documents (MVAC, electrical, plumbing, fire services, lifts), classify them by filename, organise and batch-upload them into six knowledge bases, then tested retrieval with domain questions to confirm the agent cited the right document."
      ],
      "quote": "Classified 1,000+ documents via Python into 6 RAG knowledge bases, then tuned and tested retrieval."
    },
    {
      "heading": "PRDs for The Henderson's digital twin",
      "paragraphs": [
        "For each feature I specified the purpose, the API endpoints to source (IoT and government data), polling frequency, how many data points to show and where in the UI — product-manager work with an engineering spine."
      ]
    },
    {
      "heading": "ESG energy-saving model",
      "paragraphs": [
        "IGC needed convincing ESG numbers for an ICT Awards application but had no historical baseline. I designed a horizontal benchmark: theoretical consumption from EMSD benchmarks against actual bills, adjusted for a 73% occupancy rate, refined with senior PMs and defended to clients."
      ]
    },
    {
      "heading": "Public housing IoT proposal",
      "paragraphs": [
        "Researched NFC access, fall-detection sensors, overhead-object detection and parking monitoring for a smart-estate proposal centred on BuildingOS, and presented it to the Hong Kong Housing Authority."
      ]
    }
  ],
  "tags": ["PRD Writing", "RAG", "Python", "API Design", "Digital Twin", "ESG", "IoT"]
}
```

- [ ] **Step 7: zh twins**

```bash
for s in insurance-program vehicle-parking meeting-minutes cathay-hackathon neochain igc; do cp content/projects/$s/en.json content/projects/$s/zh.json; done
```

- [ ] **Step 8: Validator — projects green, covers still red**

Run: `npm test 2>&1 | grep -E "^(ok|not ok)"`
Expected: all `projects/*` lines `ok`. `work/*` still `not ok` (cover files missing) and `projects/*` poster checks pass only where posters exist — so `insurance-program`, `vehicle-parking`, `meeting-minutes`, `cathay-hackathon` will be `not ok` on `poster exists` until Task 8. Confirm the *only* failing assertions are cover/poster existence: `npm test 2>&1 | grep -B2 "AssertionError" | grep -E "cover|poster"`.

- [ ] **Step 9: Commit**

```bash
git add content/projects
git commit -m "content(v2): six project pages with demo modes, guides, facts and sections

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Project detail page

**Files:**
- Create: `app/components/project/DemoFrame.tsx`, `DemoRecording.tsx`, `DemoStatic.tsx`, `GuideSteps.tsx`
- Replace: `app/[locale]/projects/[slug]/page.tsx`

- [ ] **Step 1: `app/components/project/DemoFrame.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";

const QUERY = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

type Props = {
  url: string;
  title: string;
  height?: number;
  poster?: string;
  activateLabel: string;
  openLabel: string;
  mobileNote: string;
};

export default function DemoFrame({ url, title, height = 720, poster, activateLabel, openLabel, mobileNote }: Props) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [active, setActive] = useState(false);

  if (!isDesktop) {
    return (
      <div className="border border-ink">
        <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
          {poster ? <Image src={poster} alt="" fill sizes="100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
          <span className="text-ink/70">{mobileNote}</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
            {openLabel}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-ink" style={{ height }}>
      <iframe
        src={url}
        title={title}
        loading="lazy"
        className={`block w-full h-full bg-paper ${active ? "" : "pointer-events-none"}`}
      />
      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 flex items-end p-4 cursor-pointer"
          aria-label={activateLabel}
        >
          <span className="border border-ink bg-paper px-3 py-1.5 text-[12px] font-medium">{activateLabel}</span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: `app/components/project/DemoRecording.tsx`**

```tsx
import Image from "next/image";

type Props = { video?: string; poster?: string; url?: string; note: string; openLabel: string };

export default function DemoRecording({ video, poster, url, note, openLabel }: Props) {
  if (video) {
    return (
      <div className="border border-ink">
        <video controls playsInline muted loop preload="metadata" poster={poster} className="block w-full">
          <source src={video} type="video/mp4" />
        </video>
      </div>
    );
  }
  return (
    <div className="border border-ink">
      <div className="relative aspect-[16/10] border-b border-ink overflow-hidden">
        {poster ? <Image src={poster} alt="" fill sizes="100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
        <span className="text-ink/70">{note}</span>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium">
            {openLabel}
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `app/components/project/DemoStatic.tsx`**

```tsx
import Image from "next/image";

export default function DemoStatic({ poster, alt }: { poster?: string; alt: string }) {
  return (
    <div className="relative aspect-[16/9] border border-ink overflow-hidden">
      {poster ? <Image src={poster} alt={alt} fill sizes="100vw" className="object-cover object-top" /> : <div className="hatch absolute inset-0" />}
    </div>
  );
}
```

- [ ] **Step 4: `app/components/project/GuideSteps.tsx`**

```tsx
type Props = { heading: string; steps: string[] };

export default function GuideSteps({ heading, steps }: Props) {
  return (
    <section className="border border-ink">
      <h2 className="font-serif text-2xl leading-none px-4 md:px-6 py-3 border-b border-ink">{heading}</h2>
      <ol className="grid">
        {steps.map((s, i) => (
          <li key={i} className="grid grid-cols-[48px_minmax(0,1fr)] border-b border-ink last:border-b-0">
            <span className="flex items-start justify-center pt-3 text-[12px] border-r border-ink font-medium tabular-nums">{i + 1}</span>
            <p className="px-4 py-3 text-[13px] leading-relaxed">{s}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 5: Replace `app/[locale]/projects/[slug]/page.tsx`**

```tsx
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadContent } from "@/lib/content";
import { Link } from "@/i18n/routing";
import OffsetBox from "@/app/components/OffsetBox";
import DemoFrame from "@/app/components/project/DemoFrame";
import DemoRecording from "@/app/components/project/DemoRecording";
import DemoStatic from "@/app/components/project/DemoStatic";
import GuideSteps from "@/app/components/project/GuideSteps";
import { BG_CLASS, BORDER_CLASS, UNDERLINE_CLASS, type ProjectContent } from "@/lib/projects";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "projects");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const slugs = entries.filter((e) => e.isDirectory() && !e.name.startsWith("_")).map((e) => e.name);
  return ["en", "zh"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function loadProject(slug: string, locale: string): Promise<ProjectContent> {
  try {
    return await loadContent<ProjectContent>(`projects/${slug}`, locale);
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = await loadProject(slug, locale);
  return { title: `${p.title} — Alex Bao`, description: p.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("project");
  const p = await loadProject(slug, locale);
  const demoLink = p.links[0];

  return (
    <main className="pt-14 md:pt-16">
      <div className="px-5 md:px-10 pt-8 md:pt-12 pb-16 md:pb-24 max-w-5xl mx-auto grid gap-10 md:gap-14">
        <Link href={{ pathname: "/", hash: "work" }} className="text-[12px] underline underline-offset-4 justify-self-start">
          {t("back")}
        </Link>

        {/* Header card */}
        <OffsetBox blockClass={BG_CLASS[p.colour]}>
          <div className="grid md:grid-cols-[minmax(0,1fr)_auto]">
            <div className="px-5 md:px-8 py-6 md:py-8 border-b md:border-b-0 md:border-r border-ink">
              <h1 className={`font-serif text-4xl md:text-6xl leading-none underline decoration-[6px] underline-offset-[10px] ${UNDERLINE_CLASS[p.colour]}`}>
                {p.title}
              </h1>
              <p className="mt-6 text-[13px]">{p.org}</p>
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-1 text-[12px]">
              <div className="px-5 py-3 border-b border-ink md:min-w-[220px]">
                <dt className="text-ink/60 uppercase tracking-[0.14em] text-[10px]">when</dt>
                <dd className="mt-1">{p.duration}</dd>
              </div>
              <div className="px-5 py-3 border-b border-ink border-l md:border-l-0">
                <dt className="text-ink/60 uppercase tracking-[0.14em] text-[10px]">role</dt>
                <dd className="mt-1">{p.role}</dd>
              </div>
            </dl>
          </div>
        </OffsetBox>

        <p className="max-w-[68ch] text-[15px] md:text-[16px] leading-relaxed">{p.summary}</p>

        {/* Links row */}
        {p.links.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {demoLink && p.demo.mode !== "static" && (
              <OffsetBox blockClass="bg-ink" offset={8} className="inline-block">
                <a href={demoLink.url} target="_blank" rel="noopener noreferrer" className="block bg-fill px-4 py-2.5 text-[13px] font-medium">
                  {t("openDemo")}
                </a>
              </OffsetBox>
            )}
            {p.links.slice(p.demo.mode !== "static" ? 1 : 0).map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-[13px] underline underline-offset-4 decoration-1 hover:decoration-2">
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* Demo */}
        {p.demo.mode === "embed" && p.demo.url && (
          <DemoFrame
            url={p.demo.url}
            title={p.title}
            height={p.demo.height}
            poster={p.demo.poster}
            activateLabel={t("activate")}
            openLabel={t("openDemo")}
            mobileNote={t("mobileNote")}
          />
        )}
        {p.demo.mode === "recording" && (
          <DemoRecording video={p.demo.video} poster={p.demo.poster} url={p.demo.url} note={t("recordingNote")} openLabel={t("openDemo")} />
        )}
        {p.demo.mode === "static" && <DemoStatic poster={p.demo.poster} alt={p.title} />}

        {p.guide && <GuideSteps heading={p.guide.heading} steps={p.guide.steps} />}

        {/* Facts */}
        <dl className="grid sm:grid-cols-2 border border-ink">
          {p.facts.map((f) => (
            <div key={f.label} className="px-4 py-3 border-b border-ink last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-ink/60">{f.label}</dt>
              <dd className="mt-1 text-[13px]">{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* Sections */}
        <div className="grid gap-12 max-w-[70ch]">
          {p.sections.map((s) => (
            <section key={s.heading} className="grid gap-4">
              <h2 className="font-serif text-3xl leading-none">{s.heading}</h2>
              {s.paragraphs.map((para, j) => (
                <p key={j} className="text-[14px] md:text-[15px] leading-relaxed">{para}</p>
              ))}
              {s.bullets && (
                <ul className="grid gap-1.5 pl-5 list-disc text-[14px] leading-relaxed">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
              {s.quote && (
                <blockquote className={`border-l-4 pl-4 py-1 text-[13px] text-ink/80 ${BORDER_CLASS[p.colour]}`}>{s.quote}</blockquote>
              )}
            </section>
          ))}
        </div>

        {/* Tags */}
        <div className="border-t border-ink pt-6 grid gap-3">
          <h2 className="text-[11px] tracking-[0.14em] uppercase text-ink/60">{t("stack")}</h2>
          <ul className="flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <li key={tag} className="border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium">{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Typecheck, lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: both clean.

- [ ] **Step 7: Look at three pages**

Browser pane: `/en/projects/insurance-program` (embed — iframe with "click to interact" overlay; clicking removes overlay), `/en/projects/meeting-minutes` (recording — hatch + note + open link), `/en/projects/neochain` (static — hatch, no demo button, one plain link). At 375 px the embed page shows poster/hatch + note instead of iframe. The header card's colour block matches the project (blue / blue / amber).

- [ ] **Step 8: Commit**

```bash
git add -A app
git commit -m "feat(v2): demo-centred project pages with embed / recording / static modes

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Covers and posters

**Files:**
- Create: `public/projects/{insurance-program,vehicle-parking,meeting-minutes,cathay-hackathon}/cover.png`

Headless Chrome is at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Each demo is a Vite SPA on the Desktop.

- [ ] **Step 1: Cargo cover from its repo**

```bash
mkdir -p public/projects/cathay-hackathon && cp ~/Desktop/cargo-load-demo/docs/screenshots/desktop.png public/projects/cathay-hackathon/cover.png
```

- [ ] **Step 2: Start the other three demos on fixed ports (background)**

```bash
(cd ~/Desktop/insurance-demo && npm run dev -- --port 4160 --strictPort) &
(cd ~/Desktop/vehicle-parking-demo && npm run dev -- --port 4180 --strictPort) &
(cd ~/Desktop/meeting-minutes-demo && npm run dev -- --port 4185 --strictPort) &
```

Wait until `curl -s -o /dev/null -w "%{http_code}" http://localhost:4160` prints `200` for each port.

- [ ] **Step 3: Screenshot each at 1280×800**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for pair in "insurance-program:4160" "vehicle-parking:4180" "meeting-minutes:4185"; do
  slug=${pair%%:*}; port=${pair##*:}
  mkdir -p "public/projects/$slug"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,800 --virtual-time-budget=8000 \
    --screenshot="$(pwd)/public/projects/$slug/cover.png" "http://localhost:$port/"
done
ls -la public/projects/*/cover.png
```

Expected: four PNGs, each > 20 KB. Open each with the Read tool and confirm it shows the app, not a blank page; if blank, raise `--virtual-time-budget` to 15000 and retry.

- [ ] **Step 4: Stop the dev servers**

```bash
pkill -f "vite.*--port 41[68][05]" || true
```

- [ ] **Step 5: Validator fully green**

Run: `npm test`
Expected: every test `ok`; summary line `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add public/projects
git commit -m "assets(v2): demo cover screenshots

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Agent docs

**Files:**
- Replace: `DESIGN.md`, `CLAUDE.md`, `app/[locale]/CLAUDE.md`
- Create: `app/[locale]/projects/CLAUDE.md`
- Modify: `README.md` if it describes the old structure (check with `grep -n "about\|blog\|contact" README.md`)

- [ ] **Step 1: Replace `DESIGN.md`**

```markdown
# Design Spec — zijun.cloud v2

Reference: neo-brutalist single-page portfolio (gracesportfolio.com), re-coloured. Spec: `docs/superpowers/specs/2026-09-14-portfolio-v2-design.md`.

## Tokens (defined in `app/globals.css`, exposed as Tailwind colours)

| Token | Tailwind | Hex | Use |
|-------|----------|-----|-----|
| `--paper` | `bg-paper` | `#fcfbf7` | Page ground |
| `--ink` | `text-ink`, `border-ink`, `bg-ink` | `#1e1c19` | Text, every 1px rule, primary button block |
| `--fill` | `bg-fill` | `#f0eee6` | Tag fill, button faces |
| `--proj-towngas` | `bg-towngas` … | `#1f57d6` | Insurance / Fleet / Meeting minutes / future GPS |
| `--proj-cathay` | `bg-cathay` | `#0e8f7e` | 747-8F Load Planner |
| `--proj-neochain` | `bg-neochain` | `#e0a020` | NeoChain WMS |
| `--proj-igc` | `bg-igc` | `#7b4bc4` | BuildingOS Digital Twin |

Site chrome is ink-only. A project colour appears only as: the offset block behind its card, the underline on its title, the pull-quote rule on its page. Text never sits on a project colour. No gradients. No border radius. No box-shadow — depth is the offset block.

Muted text uses opacity on ink: `text-ink/70` (secondary), `text-ink/60` (labels).

## Type

| Role | Face | Class |
|------|------|-------|
| Display (name, section titles, card titles, page H1) | Instrument Serif 400 | `font-serif` |
| Body, labels, nav, tags | Geist Mono 400/500 | default (`font-mono` on body) |
| zh | Noto Serif SC | via `--font-noto-serif` fallback in `--font-serif` |

Scale: name 28px; section title `text-3xl md:text-4xl`; card title 22px; page H1 `text-4xl md:text-6xl`; body 14–15px; labels 11–12px uppercase `tracking-[0.14em]`.

## Components

- `OffsetBox` — colour block + bordered face offset 12px (8px for buttons); hover/focus slides the face onto the block.
- `SectionStarter` — full-width `border-y` strip, title left, mono subtitle right, carries the anchor id.
- `TopBar` — fixed, `border-b`, name left, anchors + resume + locale right. No hamburger; resume hides under 640px.
- Work card — duration / cover / title / org / kind+role rows, each `border-b`.
- Skill tag — `border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium`.
- Demo area — `DemoFrame` (desktop iframe + click-to-interact; mobile poster + note), `DemoRecording`, `DemoStatic`.
- `.hatch` — diagonal placeholder wherever an image is missing.

## Layout

Home is one scroll: hero → work → skills → about → footer. Section content sits in `max-w-6xl mx-auto px-5 md:px-10`. Project page content in `max-w-5xl`. Prose blocks max `68–70ch`.

## Motion

Only the OffsetBox slide (`transition-[top,left] duration-300`). Reduced-motion disables it globally.

## Do not

- Add rounded corners, shadows, gradients, or a second accent for site chrome
- Put text on a project colour
- Use Inter / Roboto / Arial / Cormorant
- Hardcode hex in TSX — use the Tailwind colour classes above
```

- [ ] **Step 2: Replace `CLAUDE.md`**

```markdown
@AGENTS.md
@DESIGN.md

# zijun.cloud — Personal Website (v2)

## Architecture

- **Framework**: Next.js 16 App Router + Tailwind CSS v4 + next-intl (en/zh, locale prefix)
- **Pages**: `/[locale]` (single long-scroll home) and `/[locale]/projects/[slug]`
- **Content**: `content/<section>/<locale>.json` for all body text; `messages/<locale>.json` only for nav labels and project-page UI strings
- **Validation**: `npm test` runs `tests/content.test.mjs` against every content file — run it after any content edit
- **Deployment**: Vercel, auto-deploy on push to `main`

## Content system

```ts
const data = await loadContent<MyType>("work", locale);   // lib/content.ts
```

| File | Read by |
|------|---------|
| `content/home` | `app/components/home/Hero.tsx` |
| `content/work` | `WorkGrid.tsx` (six cards; `colour` must be one of `lib/projects.ts` PROJECT_COLOURS) |
| `content/skills` | `SkillsSection.tsx` |
| `content/about` | `AboutSection.tsx` (photos: `src: ""` renders a hatch placeholder) |
| `content/contact` | `ContactSection.tsx` |
| `content/projects/<slug>` | `app/[locale]/projects/[slug]/page.tsx` — schema in `lib/projects.ts` `ProjectContent` |

Demo modes on a project: `embed` (iframe, needs `url`, optional `height`), `recording` (needs `video` mp4 or falls back to poster), `static`.

Adding a project: create `content/projects/<slug>/{en,zh}.json`, add a card to `content/work/*.json`, drop `public/projects/<slug>/cover.png`, run `npm test`.

## Conventions

- Server Components by default; the only client files are `TopBar`, `PhotoRow`, `DemoFrame`
- Locale: `const { locale } = await params; setRequestLocale(locale);`
- NEVER hardcode English or Chinese in TSX — content JSON or `messages`
- NEVER hardcode colours — Tailwind classes from DESIGN.md
- zh content files are currently copies of en until translated

## Verify before claiming done

`npm test && npx tsc --noEmit && npm run lint && npm run build`, then look at `/en` and one project page at 1280 px and 375 px.
```

- [ ] **Step 3: Replace `app/[locale]/CLAUDE.md`**

```markdown
@../../CLAUDE.md

# Home (single page)

`page.tsx` composes five async Server Components from `app/components/home/`, each loading its own content file. Section anchors (`work`, `skills`, `about`) live on `SectionStarter` and are targeted by `TopBar` links as `{ pathname: "/", hash }`.

Hero image slot is intentionally an empty hatch box until Alex chooses an image.
```

- [ ] **Step 4: Create `app/[locale]/projects/CLAUDE.md`**

```markdown
@../../../CLAUDE.md

# Project pages

`[slug]/page.tsx` renders `content/projects/<slug>/<locale>.json` (`ProjectContent` in `lib/projects.ts`):

header card (OffsetBox in project colour) → summary → links row (first link becomes the "open live demo" button unless mode is `static`) → demo (`embed` / `recording` / `static`) → optional guide steps → facts grid → sections (heading, paragraphs, bullets, pull quote in project colour) → stack tags.

Slugs are referenced by the demo apps' banners — do not rename `insurance-program`, `vehicle-parking`, `meeting-minutes`, `cathay-hackathon`.
```

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md CLAUDE.md "app/[locale]/CLAUDE.md" "app/[locale]/projects/CLAUDE.md" README.md
git commit -m "docs(v2): rewrite DESIGN.md and agent guides for the single-page layout

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Full verification

- [ ] **Step 1: All checks**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```

Expected: tests `# fail 0`; tsc silent; lint clean; build lists routes `/[locale]` and `/[locale]/projects/[slug]` with 12 static project pages (6 slugs × 2 locales), no warnings about `middleware`.

- [ ] **Step 2: Browser pass**

Dev server via `preview_start` (name `web`). Check at desktop width and 375 px:
- `/en`: top bar fixed with bottom rule; anchors scroll to the bordered section strips with the strip visible below the bar; six cards; hover slide; skills groups; hatch photo row scrolls horizontally on mobile; footer mail button.
- `/zh`: renders (English copy for now), locale toggle switches back.
- `/en/projects/cathay-hackathon`: header card teal block; open-demo button; iframe overlay; guide has 4 numbered steps; pull quote has teal rule.
- `/en/projects/neochain`: amber; no demo button; hatch static area.
- No horizontal page scroll at 375 px on any page.

- [ ] **Step 3: Fix anything found, re-run Step 1, commit**

```bash
git add app lib content messages public tests docs .claude/launch.json
git commit -m "fix(v2): verification pass

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 4: Push the branch (no merge)**

```bash
git push -u origin feat/portfolio-v2
```

Vercel builds a preview URL for the branch; report it. Merging to `main` waits for Alex's review and for the four demo subdomains to be live so the iframes resolve.

---

## Deferred (not in this plan)

- zh translations of every content file
- Meeting-minutes recording (`demo.video` mp4) — record once `minutes-demo.zijun.cloud` is live
- Real photos in `content/about/*.json` and `public/photos/`
- Hero image
- GPS utilisation card (7th) with geofence diagrams
- `[TO FILL]` outcome facts in project files
- Blog, SEO/sitemap
