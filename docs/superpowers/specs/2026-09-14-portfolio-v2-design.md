# Portfolio v2 — Design Spec

Date: 2026-09-14 · Branch: `feat/portfolio-v2` · Reference: https://www.gracesportfolio.com/

## Decisions (from grilling session)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Visual language | Hybrid: neo-brutalist structure (1px borders, hard offset-shadow cards, mono type) + own palette. No neon gradients. |
| 2 | Palette | Paper: warm off-white base (~#f5f2eb), ink black text (not pure #000), one vintage accent (mustard or brick red). Final hex values chosen via a swatch comparison before build. |
| 3 | Structure | Single long-scroll home: intro → work → skills → about (+ photos) → contact/footer. Only `/projects/[slug]` remains as a separate route. `/blog` and `/contact` routes removed. i18n (en/zh) kept; English first, zh content filled later. |
| 4 | Work cards | 6 cards: Insurance Programme, Fleet Management, Meeting Minutes, 747-8F Load Planner, NeoChain WMS, IGC Digital Twin. Each tagged Internship / Co-founder / Hackathon. Towngas trio share a colour family. GPS utilisation analysis is a planned 7th card (geofence diagrams) — schema must allow it, not built now. |
| 5 | Skills | Three groups: Methods / Tools / Technical (grey boxed tags, ordered by relevance) + one Languages line. |
| 6 | Photography | One row of small photos at the end of About, click-to-enlarge lightbox. Placeholder images now; list lives in content JSON, Alex drops files into `public/photos/`. Intro image slot (next to hero text) left empty. |
| 7 | Copy | Hero one-liner in lowercase identity-list style. Availability tag: "available Jan – Sep 2027 for internships". About paragraph: existing 4 paragraphs compressed to one, marked `[TO FILL]` for personal details. |
| 8 | Project detail depth | Between full case study and lite: title card → "open live demo" button → demo (embed or recording) → guided "how to try it" steps with screenshots → Problem / What I built / Outcome → stack & disclosure notes. Each project's sections differ; schema is a sections array. |
| 9 | Demo presentation | `demo.mode` per project: `embed` (insurance, fleet, cargo) with click-to-interact overlay, lazy-load, desktop only; `recording` (meeting minutes, ~20s); `static` (NeoChain, IGC). Mobile always falls back to screenshot + button. |
| 10 | Demo hosting | Deployed in a parallel session. URLs fixed now: insurance-demo / fleet-demo / cargo-demo / minutes-demo `.zijun.cloud`. Site shows placeholder until live. |
| 11 | Fonts | Instrument Serif (display) + Geist Mono (body/labels) + Noto Serif SC (zh). Existing Geist woff2 stays for any sans need. |
| 12 | CV | Replace `public/cv.pdf` with `~/Desktop/Bao_Zijun_HKU_CV.pdf`. Content sourced from the new CV (Towngas trainee Jun–Dec 2026, IGC, NeoChain, Cathay). |

## Reference-site anatomy (what we borrow)

- Fixed top bar with 1px bottom border: name left, nav anchors right (work / skills / about / resume).
- Section starter bars: full-width bordered strip with H1 left and a mono subtitle right.
- Work card = bordered box offset 1em over a solid colour block; hover slides card back to origin (`top/left: -1px`).
- Skills = `h4` tags with 0.1em border, grey fill, `width: fit-content`, flex-wrap.
- About = paragraph → image row (~12.5% width each) → optional second row.
- Contact = bordered mail button with same offset-shadow trick over an accent block.
- Project page: bordered header card → hero image → info row (overview / role / stack) → sections with side-coloured pull quotes.

## Non-goals this round

- Blog, guestbook, GPS card, photo selection, zh copy, SEO/sitemap.
