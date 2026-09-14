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
- `TopBar` — fixed, `border-b`, 64/80px tall; serif name left, serif anchor links + resume + boxed locale toggle right. No hamburger; resume hides under 640px.
- Work card — 352px wide (`max-w-[22rem]`, full width on phones) in a `flex-wrap justify-evenly` row with `gap-x-8 gap-y-16`; rows duration / cover (16:10) / title / org / kind+role, each `border-b`.
- Skill tag — `border border-ink bg-fill px-2.5 py-1.5 text-[12px] font-medium`.
- Demo area — `DemoFrame` (desktop iframe + click-to-interact; mobile poster + note), `DemoRecording`, `DemoStatic`.
- `.hatch` — diagonal placeholder wherever an image is missing.

## Layout

Home is one scroll: hero → work → skills → about → footer. Hero is a centred row (text `max-w-[44ch]` + 340px portrait) with `pt-36 md:pt-56 pb-24 md:pb-40`. Section bodies sit in `max-w-[1400px] mx-auto px-6 md:px-20 py-16 md:py-24` (skills `max-w-[1100px]`, groups centred). Project page content in `max-w-[1240px] px-6 md:px-16`. Prose blocks max `70–72ch`.

## Motion

Only the OffsetBox slide (`transition-[top,left] duration-300`). Reduced-motion disables it globally.

## Do not

- Add rounded corners, shadows, gradients, or a second accent for site chrome
- Put text on a project colour
- Use Inter / Roboto / Arial / Cormorant
- Hardcode hex in TSX — use the Tailwind colour classes above
