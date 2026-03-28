@../../CLAUDE.md

# Home / Hero Section

## Content Source
- Eyebrow + tagline: `content/home/{en,zh}.json`
- Name, role, CTA labels: `messages/{en,zh}.json` under `home.hero`

## Content Schema (`content/home/en.json`)
```json
{
  "eyebrow": "Currently Open to Opportunities",
  "tagline": "Building systems that learn, warehouses that think, ideas that scale"
}
```

## Structure
- Full-screen hero with centered content
- Does NOT use SectionContainer (unique layout)
- Staggered fade-in animations (delay-1 through delay-5)
- Corner decorations: fixed L-shaped borders (desktop only concept, but visible on mobile too)
- Scroll indicator: gradient vertical line at bottom

## Design Notes
- Hero name: `font-serif text-6xl md:text-8xl font-medium tracking-tight`
- Role: `text-[#b85c38]/70 tracking-wide`
- CTAs: primary (filled accent) + secondary (ghost border), `rounded-full`
