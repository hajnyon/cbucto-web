# Agents

## Project overview

Static website for CB Účto s.r.o. (accounting firm). Built with Nunjucks templates, Tailwind CSS, and a custom Node.js build script. Output goes to `./docs`.

## Tech stack

- **Templating**: Nunjucks (`.njk` files in `src/`)
- **CSS**: Tailwind CSS 3 via PostCSS (config in `tailwind.config.js`)
- **Fonts**: Inter variable font, self-hosted via `@fontsource-variable/inter`
- **Build**: Custom Node.js script (`build.js`)

## Key conventions

- Templates live in `src/`, build output in `docs/`. Never edit files in `docs/` directly.
- Layouts (`src/layouts/`) provide the HTML skeleton. Pages extend them.
- Partials (`src/partials/`) are included for nav, footer, and icon macros.
- Icon macros in `src/partials/icons.njk` reduce SVG duplication. Import with `{% from "partials/icons.njk" import check, chevronRight %}`.
- Page metadata (title, description, etc.) is passed from the `pages` array in `build.js`, not set in templates.
- Blog pages extend `layouts/blog.njk` and override `featuredImage` and `articleContent` blocks.
- Static assets go in `src/assets/` and are copied to the build root.
- CSS uses `@tailwind` directives and `@font-face` declarations. Tailwind scans `src/**/*.njk` for class detection.
- The year in the footer is set at build time, not via client-side JS.

## Commands

- `npm run build` — build the site
- `npm run clean` — remove `docs/`

## Adding pages

Add a new entry to the `pages` array in `build.js` and create the corresponding `.njk` template in `src/pages/`.
