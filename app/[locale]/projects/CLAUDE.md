@../../../CLAUDE.md

# Projects Section

## Content Source
- Project listing: `content/projects/_index/{en,zh}.json`
- Project details: `content/projects/{slug}/{en,zh}.json`
- Page title/subtitle: `messages/{en,zh}.json` under `projects`

## Content Schema — Listing (`content/projects/_index/en.json`)
```json
{
  "eyebrow": "Work",
  "projects": [
    {
      "slug": "neochain",
      "title": "NeoChain WMS",
      "tagline": "AI-Powered Warehouse Management System",
      "tags": ["Next.js", "TypeScript", "AI", "PDA", "Python"],
      "year": "2025—Present",
      "type": "Co-founder"
    }
  ]
}
```

## Content Schema — Detail (`content/projects/neochain/en.json`)
```json
{
  "title": "NeoChain WMS",
  "meta": { "year": "...", "role": "...", "url": "...", "urlLabel": "..." },
  "description": "...",
  "sections": [
    { "heading": "The Problem", "paragraphs": ["..."], "bullets": ["..."] }
  ],
  "tags": ["Next.js", "TypeScript", ...]
}
```

## Architecture
- `projects/page.tsx` — listing page, reads from `_index` content
- `projects/[slug]/page.tsx` — dynamic detail page with `generateStaticParams()`
- To add a new project: create `content/projects/{new-slug}/en.json` + `zh.json`, add entry to `_index`

## Design Notes
- Listing: Swiss-style, no cards, `h-px` dividers, `hover:bg-[#3d2b1f]/[0.02]`
- Detail: back link → meta row (year · role) → h1 → description → sections → tags
- Tags: `<TagList size="base">` with `pt-10 border-t`
