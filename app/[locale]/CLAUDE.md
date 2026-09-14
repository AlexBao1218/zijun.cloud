@../../CLAUDE.md

# Home (single page)

`page.tsx` composes five async Server Components from `app/components/home/`, each loading its own content file. Section anchors (`work`, `skills`, `about`) live on `SectionStarter` and are targeted by `TopBar` links as `{ pathname: "/", hash }`.

Hero image comes from `content/home.image` (`{ src, alt }`, file under `public/photos/`); when absent the slot renders a hatch placeholder. About photos come from `content/about.photos`; an empty `src` renders a hatch placeholder.
