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
