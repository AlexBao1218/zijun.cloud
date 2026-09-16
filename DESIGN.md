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

Scale: name 28/36px; nav links serif 20/26px; section title `text-4xl md:text-5xl`; card title 26px; page H1 `text-4xl md:text-6xl`; hero sentence 17/20px; body 15–16px; labels 12–13px uppercase `tracking-[0.14em]`.

## Components

- `OffsetBox` — colour block + bordered face offset 16px (the reference's 1em) for cards and header cards, 8px for buttons; hover/focus slides the face onto the block.
- `SectionStarter` — full-width `border-y` strip, title left, mono subtitle right, carries the anchor id.
- `TopBar` — fixed, `border-b`, 64/80px tall; serif name left, serif anchor links + resume right (no locale toggle — zh routes exist but are not linked). No hamburger; resume hides under 640px.
- Work card — width is `--card` from `.work-scope` (globals.css, a `@container` on the work body): `22rem` under lg, `min(26rem, 100cqw/3.27)` from lg so three cards always share one row (269px @1024 → 416px cap ≥1600); full width on phones. The card is its own `@container` — cell padding, meta and title (`max(24px, 7.21cqw)`) scale with it. Rows duration / cover / title / org / kind+role, each `border-b`. The cover is a 16:10 box tinted with the project colour (`TINT_CLASS`, 22 % over paper) holding the screenshot in a slight 3-D tilt (`perspective(700px) rotateY(-16deg) rotateX(4deg)`) that runs off the right and bottom edges; no cover → hatch.
- Work rows — a multi-card group is `flex-wrap` under lg and `grid-cols-3 gap-x-[var(--gap)]` from lg, wrapper capped at `--row` (three cards + two gaps); each item carries `data-work-card`. Single-card groups render side by side (`singles: "row"`) or under a `singlesHeading` as `Showcase` (`singles: "carousel"`, `hidden md:block`): active card centred at `--card` wide, neighbours 0.8× and 45 % opacity `--step` to each side, ← → buttons and square dots, a brief column one card wide on the right (its right edge lines up under the third card); arrow keys work. Under md the showcase is a stacked list of heading / card / brief.
- `WorkHint` — handwritten "click to open" (`font-hand`, content `hint`) beside the first Towngas card: in the page gutter with a level line into the card when the margin is ≥ first line + 40px (≈1500+), otherwise under the card with a line hooking up into its bottom edge (1024–1280); nothing on phones. Measured from `data-work-card`, draws on with the `.sketch` `[data-draw]`/`[data-fade]` rules; SVG filter id `wob-hint`.
- Skill tag — `border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium`.
- Demo area — `DemoFrame` (server-rendered iframe shown from md up, live immediately, scaled down from the demo's native `width` when the column is narrower; phones get poster + link), `DemoRecording`, `DemoStatic`.
- `GuideFlow` — the "how to try it" flowchart: bordered boxes with a small index, a mono label and an italic serif hint, joined by hairline arrows; a row on desktop, a column on phones. Labels ≤ 28 chars, hints ≤ 60.
- Sketches (`app/components/project/sketches/*`) — hand-drawn inline SVGs (1.4px ink strokes, `feTurbulence` wobble, mono labels, italic serif asides, one accent in the project colour) that draw on when scrolled into view (`Sketch` wrapper + `[data-draw]` / `[data-fade]` in globals.css). Referenced from content by `section.sketch` key.
- Prints (`Prints`) — instax-style prints scattered around a mono paragraph, one row per theme (`content/about` `prints[].items`, photos and `{ text }` interleaved). A print is `bg-white border border-ink p-2 pb-10` with a `font-hand` caption on the bottom margin, width a share of the row (`lg` 24 %, `md` 17 %, `sm` 13 %; text 23 %), each tilted and lifted by a fixed sequence (`TILT`/`LIFT`, CSS vars) and straightening on hover. Rows are `flex justify-between` from lg and wrap to two-up on phones. No sprockets, no shadow. Click a print for the lightbox.
- Photo notes (`PhotoNotes`) — wraps the board and draws handwritten notes (`content/about` `notes`: strip / photo / side) in the gutter (`left`/`right`, needs ≥ 90px margin and a first line that fits it — keep the first line short) or under the band (`below`); lines after the first wrap to the note's width. Under md the notes become `font-hand` captions under the prints (currently no notes — the captions do that job).
- `LifeMap` — the "where i've lived" block: a `Sketch` box holding the China outline SVG (scales to its column, no min width) with the five stops as pins and an animated route; city labels are HTML (`font-mono text-[11px] sm:text-[12px]`) positioned in % over the SVG so they stay legible at phone width. Right column (`lg:grid-cols-[minmax(0,1fr)_320px] xl:…460px`): serif title, italic lede, a mono stop ledger (`ol`, city — stage, hairline rows) and a short paragraph, `justify-between` so the column is exactly the map's height.
- `.hatch` — diagonal placeholder wherever an image is missing.

## Layout

Home is one scroll: hero → work → skills → about → footer. Hero is a centred row (text `max-w-[44ch]` + 340px portrait) with `pt-36 md:pt-56 pb-24 md:pb-40`. Section bodies sit in `max-w-[1700px] mx-auto` (work `px-6 md:px-16 lg:px-[clamp(4rem,7vw,7rem)]` so the card width never jumps at a padding step; about `px-6 md:px-20 xl:px-28`; skills `max-w-[1100px]`), groups centred. Project page content in `max-w-[1240px] px-6 md:px-16`. Prose blocks max `70–72ch`.

## Motion

Only the OffsetBox slide (`transition-[top,left] duration-300`). Reduced-motion disables it globally.

## Do not

- Add rounded corners, shadows, gradients, or a second accent for site chrome
- Put text on a project colour
- Use Inter / Roboto / Arial / Cormorant
- Hardcode hex in TSX — use the Tailwind colour classes above
