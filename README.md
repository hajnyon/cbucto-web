# CB Účto s.r.o. - cbucto.cz

Website for CB Účto s.r.o. - accounting services in České Budějovice.

## Prerequisites

- Node.js 18+

## Setup

```bash
npm install
```

## Development

Build the site into `./docs`:

```bash
npm run build
```

Clean the build output:

```bash
npm run clean
```

## Project structure

```
src/
├── layouts/          # Nunjucks base layouts
│   ├── base.njk      # HTML skeleton (head, meta, CSS link)
│   └── blog.njk      # Blog article layout (breadcrumb, header, author)
├── partials/         # Reusable template parts
│   ├── nav.njk       # Navigation (adapts for home vs inner pages)
│   ├── footer.njk    # Footer (full on home, simplified on blog)
│   └── icons.njk     # SVG icon macros
├── pages/            # Page templates → build output
│   ├── index.njk     # Homepage
│   └── blog/         # Blog articles
├── css/
│   └── main.css      # Tailwind directives + @font-face
└── assets/           # Static files copied to build root
    ├── logo.png
    └── image.png
```

## Build pipeline

The build script (`build.js`) does the following:

1. Cleans `./docs`
2. Copies static assets from `src/assets/` to `docs/`
3. Copies Inter font files (latin + latin-ext) from `@fontsource-variable/inter` to `build/fonts/`
4. Compiles CSS via PostCSS (Tailwind + Autoprefixer) to `build/css/main.css`
5. Renders Nunjucks templates from `src/pages/` to `docs/`

Page metadata (titles, descriptions, blog post data, pricing) is defined in `build.js`.

## Adding a new blog post

1. Create `src/pages/blog/your-post.njk` extending `layouts/blog.njk`
2. Add a page entry in the `pages` array in `build.js` with metadata
3. Add a blog card entry in the `blogPosts` array in `build.js`
4. Run `npm run build`

## Services

- [Tally](https://tally.so) - contact form
- [Simple Analytics](https://simpleanalytics.com) - privacy-friendly website analytics
