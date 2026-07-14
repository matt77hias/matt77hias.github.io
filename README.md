<img align="left" src="assets/Avatar.png" width="120px"/>

[![License][s1]][li]

[s1]: https://img.shields.io/badge/licence-No%20Licence-blue.svg
[li]: https://raw.githubusercontent.com/matt77hias/matt77hias.github.io/master/LICENSE.txt

# [matt77hias.github.io](https://matt77hias.github.io)

Personal website of [Matthias Moulin](https://matt77hias.github.io) — rendering engineer and computer graphics researcher.

## Stack

Vanilla HTML, CSS, and JavaScript. No build step, no framework.

- **Layout** — glassmorphism dark-first design with full light-mode support via CSS custom properties
- **Data** — JSON files (`data/`) drive all content; no CMS or static-site generator
- **Navigation** — shared site chrome (`src/js/layout.js`) injected once per page
- **Search** — client-side fuzzy search via [Fuse.js](https://fusejs.io)
- **PDF viewer** — [PDF.js](https://mozilla.github.io/pdf.js) for inline PDF display
- **Effects** — canvas-based glitch animation on the profile photo; CSS-slice glitch on the header title

## Structure

```
assets/         Static assets (images, fonts, publication/project files)
data/           JSON content (projects, publications, posts, authors, links)
src/
  css/          Stylesheets (tokens, base, header, navigation, items, ...)
  js/
    core/       Data store (store.js)
    effects/    Glitch canvas, glitch text, glitch toggle
    ui/         Item rendering, view management, search/filter controls
    views/      Page-level view entry points
    layout.js   Shared chrome (header, nav, profile bar, footer)
  external/     Vendored dependencies (Fuse.js, PDF.js)
```

## Dependencies

| Library | License |
|---------|---------|
| [Fuse.js v6.6.2](https://fusejs.io) | [Apache 2.0](src/external/fuse/LICENSE) |
| [PDF.js](https://mozilla.github.io/pdf.js) | [Apache 2.0](src/external/pdf.js/LICENSE) |
| [Open Sans](https://fonts.google.com/specimen/Open+Sans) | [Apache 2.0](assets/fonts/Apache%20License.txt) |

## Development

Serve locally with any static file server, e.g.:

```bash
python -m http.server 8080
```

No build, compilation, or package installation required.

## References

- [Google Scholar inclusion guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)
- [The Open Graph protocol](https://ogp.me)
- [Twitter Card validator](https://cards-dev.twitter.com/validator)

<p align="center">Copyright © 2015-2026 Matthias Moulin. All Rights Reserved.</p>
