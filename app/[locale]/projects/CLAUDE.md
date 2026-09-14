@../../../CLAUDE.md

# Project pages

`[slug]/page.tsx` renders `content/projects/<slug>/<locale>.json` (`ProjectContent` in `lib/projects.ts`):

header card (OffsetBox in project colour) → summary → links row (first link becomes the "open live demo" button unless mode is `static`) → demo (`embed` / `recording` / `static`) → optional guide steps → facts grid → sections (heading, paragraphs, bullets, pull quote in project colour) → stack tags.

Slugs are referenced by the demo apps' banners — do not rename `insurance-program`, `vehicle-parking`, `meeting-minutes`, `cathay-hackathon`.
