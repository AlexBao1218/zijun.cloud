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
| `content/home` | `app/components/home/Hero.tsx` (optional `image: { src, alt }` renders in the hero slot; absent → hatch placeholder) |
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
