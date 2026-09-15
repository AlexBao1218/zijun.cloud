# Handoff — refine every work card's content (zijun.cloud v2)

Written 2026-09-15 by the session that built v2. This is the full brief for a fresh session.
Alex (GitHub AlexBao1218) is the user; he speaks Chinese, likes direct options, no over-explaining.

## Where we are

- Repo `/Users/asuna/Desktop/zijun.cloud`, branch **`feat/portfolio-v2`** (HEAD `c0c680a`, pushed). `main` is the old live site — do NOT merge, do NOT touch main.
- Site: single long-scroll home (hero → work → skills → about + photos → footer) + `/[locale]/projects/[slug]`. Next.js 16.2 App Router, Tailwind v4, next-intl (en/zh; **zh files are byte copies of en — keep them copies after every edit**).
- Read `CLAUDE.md`, `DESIGN.md`, `docs/superpowers/specs/2026-09-14-portfolio-v2-design.md` first. `AGENTS.md`: this Next version differs from training data — read `node_modules/next/dist/docs/` before touching framework code.
- Verify before claiming done: `npm test && npx tsc --noEmit && npm run lint && npm run build`, then screenshot `/en` and a project page at 1280 px and 375 px. `npm test` (22 tests) validates every content JSON — run after every content edit.
- Dev server: `npm run dev`. Known gotcha: Turbopack sometimes serves stale `globals.css` — stop server, `rm -rf .next`, restart.
- Git: **never `git add -A` / `git add .`** — the repo root has Alex's untracked scratch files (`SKILL.md`, `examples.md`, `reference.md`, `skills/`, `.claude-design/`, two 截屏 PNGs, `SHKP Interview(1).pdf`) and a modified `README.md` / `.claude/settings.local.json` that must not be committed. Stage explicit paths, check `git status --porcelain` before every commit. Commit messages end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## The task: refine each work card's content

"Work card" = a project, i.e. both its card on the home page (`content/work/en.json` → `cards[]`: title / org / duration / role / brief / cover / colour) and its project page (`content/projects/<slug>/en.json`, schema in `lib/projects.ts` `ProjectContent`). Alex will go project by project. Ask him which one first; default order is the home order.

Six projects:

| slug | title on card | org | colour | demo |
|---|---|---|---|---|
| insurance-program | Insurance Programme | Towngas | towngas | embed https://insurance-demo.zijun.cloud (1280×940) |
| vehicle-parking | Fleet Management | Towngas | cathay (deliberate — Alex wanted the three Towngas cards to alternate colours, not all blue) | embed https://fleet-demo.zijun.cloud (1100×960) |
| meeting-minutes | Meeting Minutes | Towngas | neochain (same reason) | embed https://minutes-demo.zijun.cloud/workbench (900×1150) |
| cathay-hackathon | Air Cargo Load Planner | Cathay Hackathon 2025 | cathay | embed https://cargo-demo.zijun.cloud (1100×900) |
| neochain | NeoChain WMS | NeoChain Co. | neochain | static (cover + `/projects/neochain/pda.png`) |
| igc | BuildingOS Digital Twin | Intelli Global Corporation | igc | static |

Card roles are fixed by Alex: Cathay "Team lead / PM & UI", NeoChain "Co-founder / Full-Stack", IGC "Product Intern (3 months)". Towngas cards show a 3-word summary as role ("Data · Dashboards · AI" etc.).

Home layout: Towngas = full-width group of 3 cards; Cathay / NeoChain / IGC = one row via the `Showcase` record-picker carousel (`singles: "carousel"`), whose right-side brief panel shows **only** title, `brief`, link — no org/duration/role there (Alex's rule).

## Project page anatomy (`app/[locale]/projects/[slug]/page.tsx`)

header OffsetBox (title, org, duration, role) → `summary` → links row (`links[]`, first demo link becomes the "open fullscreen ↗" button; label key `project.openDemo` in `messages/en.json`) → demo (`demo.mode` embed / recording / static) → `guide` ("how to try it" flowchart: `steps[{label ≤28 chars, hint ≤60}]`, 3–4 boxes) → `facts[]` (must be an even count; labels Timeline / Role / Scope / Stack only) → `sections[]` (`heading`, `paragraphs[]`, optional `bullets[]`, `quote`, `sketch`, `image{src,alt}`) → `tags[]`.

Sketches = animated hand-drawn SVGs in `app/components/project/sketches/` (`InsuranceLink`, `FleetThree`, `MinutesTwoPass`, `CargoLockSolve`, `IgcAlarmAgent`; shared helpers in `common.tsx`, registry in `index.tsx`, keys in `lib/projects.ts` `SKETCHES`). Style: 1.4 px ink strokes, `feTurbulence` wobble, mono labels, italic serif asides, one accent in the project colour, draw-on via `Sketch` wrapper + `[data-draw]` / `[data-fade]`. If content changes need a new diagram, add a key to `SKETCHES` + a component + register it; diagrams must follow the structure in Alex's own decks exactly and carry few words.

## Alex's hard rules for this content (he has repeated these — follow them)

1. **Job-hunting site.** No project progress/status, no results-as-reporting, no "handover by October", no collaborator names or "with the X team". Explain the problem and what was built, that's it.
2. **Do not name SHKP or The Millennity** anywhere (IGC project). "Intelli Global Corporation" / "BuildingOS" are fine.
3. **Few words, precise.** Each page ≈ one-sentence problem → what was built (2–3 decisions) → one clean diagram or product screenshot → stack. He called the first draft "乱、完全草稿"; sketches must be accurate and good-looking.
4. Fleet page explains **look up / request / approve only** — no 07:00 automation.
5. Source facts only from Alex's own material: `InternReport_9.3.pptx` (Towngas projects; git-ignored copy in repo root) and `SHKP Interview(1).pdf` (NeoChain + IGC; untracked in repo root). Don't invent numbers.
6. No "AI-native" cheesy phrasing, no "vendor", no "sole builder". Plain, confident, human.
7. Design rules: never hardcode English/Chinese or colours in TSX; content JSON only; no rounded corners / shadows / gradients; text never sits on a project colour.
8. Wording Alex chose elsewhere: skills section dropped "MILP/OR", "PowerPoint", "Spark & Aily", "(pandas)". Project pages still mention MILP (Cathay) and Feishu Spark/Aily (Towngas stacks) — ask him whether those should stay on the pages.

## Things left open (raise when relevant, don't do unasked)

- zh translations (still English copies).
- GPS utilisation as a future 7th Towngas card (geofence diagrams).
- GitHub links for the still-private repos (insurance-program-demo, cargo-load-demo).
- Photo-wall alternative: 7 references were shown (antfu, macwright, paulstamatiou, adactio, paulrobertlloyd, nazhamid, kottke); Alex hasn't chosen — film strips stay.
- Vercel preview builds per push at https://zijun-cloud-git-feat-portfolio-v2-alexbaos-projects.vercel.app (behind Vercel SSO; Alex must be logged in). Merge to main = production, Alex's call only.

## How to work with Alex

Give 2–3 concrete options with a recommendation, show screenshots after changes (headless Chrome at 1920/1280/375 works well), keep messages short, in Chinese. He notices every detail (alignment, wrapping, arrow direction). When he says "restore", restore exactly, then add on top.
