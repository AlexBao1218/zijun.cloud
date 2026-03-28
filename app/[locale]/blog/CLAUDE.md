@../../../CLAUDE.md

# Blog Section

## Content Source
- Placeholder text: `content/blog/{en,zh}.json`
- Page title/subtitle: `messages/{en,zh}.json` under `blog`
- Future posts: `content/blog/posts/*.md` (Markdown, not yet implemented)

## Content Schema (`content/blog/en.json`)
```json
{
  "eyebrow": "Writing",
  "placeholder": "Blog posts coming soon..."
}
```

## Component Structure
- `<SectionContainer>` for layout
- `<PageHeader>` for eyebrow + title + subtitle
- Currently just a placeholder paragraph

## Future: Blog Post System
When implementing the blog:
- Posts should be Markdown files in `content/blog/posts/`
- Use gray-matter for frontmatter parsing (already installed)
- Use @mdx-js packages for rendering (already installed)
- Use reading-time for estimated read time (already installed)
- Each post needs: title, date, locale, slug in frontmatter
