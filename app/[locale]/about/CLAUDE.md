@../../../CLAUDE.md

# About Section

## Content Source
- Body content: `content/about/{en,zh}.json`
- Page title/subtitle: `messages/{en,zh}.json` under `about`

## Content Schema (`content/about/en.json`)
```json
{
  "eyebrow": "Me",
  "paragraphs": ["...", "...", "...", "..."],
  "skillsLabel": "Skills",
  "skills": ["Next.js", "TypeScript", ...]
}
```

## Component Structure
- `<SectionContainer>` for layout
- `<PageHeader>` for eyebrow + title + subtitle
- Bio paragraphs rendered from content array
- Skills section uses `<TagList>` component

## Design Notes
- Body text: `text-sm md:text-base text-[#3d2b1f]/60 leading-relaxed`
- Skills: pill tags via TagList (size="sm")
- Section divider: `border-t border-[#3d2b1f]/5` with `pt-8`
- Skills label: `text-[11px] tracking-[0.2em] uppercase text-[#b85c38]/50`
