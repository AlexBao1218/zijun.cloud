@../../../CLAUDE.md

# Contact Section

## Content Source
- Body content: `content/contact/{en,zh}.json`
- Page title/subtitle: `messages/{en,zh}.json` under `contact`

## Content Schema (`content/contact/en.json`)
```json
{
  "eyebrow": "Contact",
  "links": [
    { "type": "email", "label": "Email", "value": "zijun.bao@outlook.com" },
    { "type": "external", "label": "GitHub", "value": "@AlexBao1218", "url": "..." },
    { "type": "download", "label": "Resume / CV", "value": "PDF · Bao Zijun · HKU", "url": "/cv.pdf" }
  ],
  "tagline": "Let's build something together"
}
```

## Components
- `<SectionContainer>` with custom `className="pb-16 md:pb-20"`
- `<PageHeader>` with custom subtitleClassName for tighter spacing
- `CopyEmailButton.tsx` — client component (needs useState for clipboard)
- Contact rows rendered from content links array
- Bottom: concentric circles animation + tagline

## Design Notes
- Contact rows: `py-5 border-b border-[#3d2b1f]/5`
- Icon buttons: `w-10 h-10 rounded-full`, `hover:scale-110`
- Link types: "email" renders CopyEmailButton, "external" opens new tab, "download" triggers download
