@AGENTS.md
@DESIGN.md

# zijun.cloud — Personal Website

## Architecture

- **Framework**: Next.js 16 + App Router + Tailwind CSS v4
- **i18n**: next-intl (en/zh), locale prefix in URL
- **Content**: Separated from code — all text lives in `content/{section}/{locale}.json`
- **Translations**: `messages/*.json` is ONLY for next-intl (nav labels, page titles/subtitles)
- **Deployment**: Vercel, auto-deploy on git push

## Content System

Page body content is loaded via `lib/content.ts`:
```ts
const data = await loadContent<MyType>("about", locale);
```

| Source | Purpose | Access |
|--------|---------|--------|
| `messages/*.json` | Nav labels, page titles/subtitles | `useTranslations()` / `getTranslations()` |
| `content/**/*.json` | Page body text, paragraphs, lists, metadata | `loadContent()` |

## Shared Components

- `app/components/SectionContainer.tsx` — Standard page wrapper (max-w-2xl + padding)
- `app/components/PageHeader.tsx` — Eyebrow + H1 + subtitle pattern
- `app/components/TagList.tsx` — Pill tag list (skills, tech tags)
- `app/components/Navigation.tsx` — Fixed header with locale toggle

## Key Conventions

- All pages are Server Components unless they need interactivity
- Locale: `const { locale } = await params; setRequestLocale(locale);`
- NEVER hardcode English or Chinese text in TSX — use content JSON files
- NEVER use `isEN ? "..." : "..."` for body content — that pattern is eliminated
- NEVER hardcode colors — use CSS vars from globals.css or values in DESIGN.md
- All section pages use `<SectionContainer>` and `<PageHeader>`
- Project detail pages use dynamic route `[slug]/page.tsx` reading from `content/projects/{slug}/`

## File Structure

```
content/           — All page content (JSON), edit here for text changes
messages/          — next-intl translations (nav + titles only)
lib/content.ts     — Content loader utility
app/components/    — Shared UI components
app/[locale]/      — Page routes + per-section CLAUDE.md
```

## Do NOT

- Add card-style borders/shadows
- Use AI-gradient styling
- Use Inter/Roboto/Arial fonts
- Add excessive animations
- Create new shared components without checking if one exists
