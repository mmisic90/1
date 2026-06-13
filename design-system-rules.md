# Design System Rules

Reference for integrating Figma designs into this repo via the Model Context Protocol.

This codebase is small and intentionally low-tech: vanilla HTML/CSS/JS with no
build step, no framework, and no formal design system. These rules describe
**what currently exists** and **how to extend it consistently** when bringing
designs over from Figma. Do not invent structure that isn't here — match the
existing patterns or surface a deliberate proposal first.

---

## 1. Token Definitions

There is **no design-token system** (no Style Dictionary, no CSS-in-JS theme,
no `tokens.json`). Tokens are implied via CSS custom properties and recurring
literal values.

### Where tokens live today

- **CSS variables (referenced)**: `index.html` references `var(--navy)`,
  `var(--navy2)`, `var(--white)`, `var(--gold)`, `var(--gold2)`, `var(--gray)`,
  `var(--border)` throughout its `<style>` block. **These variables are never
  declared** — there is no `:root { ... }` definition in the file. This is a
  latent bug and should be fixed when porting designs (see §11).
- **Literal tokens**: `remote.html` uses raw hex codes (`#1a1a2e`, `#7b2ff7`,
  `#a855f7`, `#ef4444`, `#3a3a5c`) and gradient stops directly inside rules.
- **Typography**: hard-coded font stacks per page.
  - `index.html`: `'Lato', sans-serif` for body, `'Playfair Display', serif`
    for display.
  - `remote.html`: system font stack
    `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- **Spacing / radius / shadow**: literal values, no scale.

### Conventions to follow

- When adding new colors from Figma, add them as CSS custom properties at the
  top of the relevant `<style>` block (each HTML file is self-contained — see
  §7 Project Structure). Do not introduce a separate stylesheet or token file
  without discussing scope first.
- Reuse the existing `--gold` / `--navy` palette names where the Figma color
  semantically matches, even if the hex shifts slightly. Don't fork the palette
  per page.
- If Figma exposes design tokens as CSS variables (via Code Connect or
  variables export), map them to the existing variable names rather than
  shipping a parallel set.

---

## 2. Component Library

There is **no component library**. Two patterns coexist:

1. **Static HTML**: marketing/landing markup is hand-written in
   `index.html` (`#hero`, `#about`, `#oblasti`, `#kontakt`) and the entire
   `remote.html`.
2. **JS-rendered**: `src/carousel.js` exports a single `createCarousel` factory
   that imperatively builds DOM via `document.createElement` and `innerHTML`.
   It depends on five fixed element IDs being present in the host page:
   `stepsIndicator`, `cardContainer`, `btnPrev`, `btnNext`, `counter`.

```js
// src/carousel.js — the only "component" abstraction in the repo
export function createCarousel(ideas, document) {
  const stepsEl = document.getElementById('stepsIndicator');
  const containerEl = document.getElementById('cardContainer');
  // ...
  return { goTo, changeStep, updateUI, getCurrent: () => current };
}
```

### Conventions

- Keep new "components" as factory functions in `src/*.js` that take a
  `document` (for jsdom testability) and return a small public API. Mirror the
  shape of `createCarousel`.
- Data lives next to the component as a default-exported array of plain
  objects. See `src/ideas.js`:

  ```js
  const ideas = [
    { title, tag, body, image, imageAlt },
    // ...
  ];
  export default ideas;
  ```

- No Storybook, no MDX, no docs site. If you need a visual reference for a new
  component, add a minimal demo HTML file at the repo root (matches existing
  `index.html` / `remote.html` pattern).

---

## 3. Frameworks & Libraries

**Runtime**: none. The browser loads ES modules directly via
`<script type="module">`.

**Tooling**:

- `vitest` + `jsdom` for tests (`npm test` → `vitest run`). Config in
  `vitest.config.js`.
- No bundler, no transpiler, no PostCSS, no Tailwind, no linter.
- `package.json` has only `devDependencies` (`vitest`, `jsdom`).

### Implication for Figma → code

- **Do not import a framework** (React, Vue, Svelte, Tailwind, etc.) when
  generating code from `get_design_context`. The Figma MCP returns
  React+Tailwind by default — you must translate it to vanilla DOM and
  hand-written CSS to match this project.
- Class names should be plain CSS classes (kebab-case), not utility classes.

---

## 4. Asset Management

- **Images are hot-linked from Unsplash** — `src/ideas.js` and the `#hero`
  background in `index.html` both load from `images.unsplash.com` with query
  params (`?w=800&q=80`, `?w=1600&q=80`). There is no local `assets/`
  directory.
- **No CDN config, no image pipeline, no `<picture>` / `srcset`.**
- The carousel sets `loading="lazy"` on card images (`src/carousel.js:34`).

### Conventions

- Prefer hosted URLs (Unsplash or similar) over committing binary assets,
  matching the existing approach. If a Figma asset must be local, place it at
  `assets/` and reference with a relative path; flag this on the PR so it can
  be reviewed.
- Always set `alt` text. The carousel falls back to `idea.title` when
  `imageAlt` is missing — provide an explicit `imageAlt` for non-decorative
  images.
- Keep `loading="lazy"` for any below-the-fold image.

---

## 5. Icon System

There is **no icon system**. Icons in the codebase today are:

- **Emoji and unicode glyphs** used as icons (`←`, `→`, `✓` in carousel
  buttons; emoji icons rendered in `.area-icon` and `.contact-item-icon`
  blocks).
- **Initials/text** as a placeholder for imagery (`.about-img-placeholder`
  containing `MM`).

### Conventions

- For new icons from Figma, prefer inline SVG pasted directly into the HTML
  (no sprite system, no icon font). Keep them small and stripped of
  unnecessary attributes.
- If a unicode glyph already covers the meaning (arrow, check, bullet),
  use it instead of adding an SVG.
- No naming convention exists yet. If you introduce more than two SVGs,
  propose a convention before scattering them.

---

## 6. Styling Approach

- **Methodology**: per-page `<style>` block embedded in the HTML file. No CSS
  Modules, no styled-components, no Tailwind, no SCSS.
- **Selectors**: plain classes (`.card`, `.step-dot`, `.area-card`,
  `.remote-header`), IDs for JS hooks (`#stepsIndicator`, `#btnPrev`).
- **Globals**: a universal reset at the top of each file:

  ```css
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  ```

- **Responsive design**: single mobile breakpoint via
  `@media (max-width: 768px)` in `index.html`. `remote.html` is
  mobile-first with `env(safe-area-inset-*)` padding for iOS notches.
- **Fluid typography**: `clamp()` is used for hero/section titles
  (`clamp(2.5rem, 6vw, 4.5rem)`). Continue this pattern for headings sized
  from Figma.
- **Hover/focus**: handled with simple `:hover` and `:focus` rules. No focus
  ring system; ensure new interactive elements have a visible focus state.

### Conventions

- Add new styles to the existing `<style>` block of the page that uses them.
  Don't extract a shared stylesheet without proposing the change first.
- Use the `var(--name)` variables already referenced in `index.html` even
  though they're undeclared today (see §11).

---

## 7. Project Structure

```
.
├── CLAUDE.md              # Instructions for Claude Code
├── design-system-rules.md # This file
├── index.html             # Carousel UI + lawyer landing page (one file)
├── remote.html            # Standalone TV remote UI
├── package.json
├── vitest.config.js
├── higgsfield-prompts.md  # Marketing prompt set, not application code
├── src/
│   ├── carousel.js        # createCarousel factory
│   └── ideas.js           # Carousel data
└── tests/
    ├── carousel.test.js
    └── ideas.test.js
```

### Patterns

- **One HTML file per top-level "app"**. `index.html` and `remote.html` are
  completely independent — different fonts, different palettes, different DOM
  conventions. Treat them as separate sub-projects when porting Figma designs.
- **`src/` is for ES-module logic only.** No CSS, no assets there.
- **`tests/` mirrors `src/`** with `*.test.js` files using Vitest + jsdom.
  Every non-trivial function should have a test (CLAUDE.md mandates this).
- **No feature folders, no `components/`, no `pages/`.** The codebase is too
  small to warrant them; don't add them speculatively.

---

## 8. Figma → Code Workflow

When using Figma MCP tools (`get_design_context`, `get_screenshot`,
`get_metadata`, `get_figjam`):

1. **Treat the React+Tailwind output as a wireframe, not a deliverable.**
   Translate to vanilla HTML + plain CSS classes that fit the host page's
   `<style>` block.
2. **Map design tokens to existing CSS variables** in `index.html` where
   possible. If the design introduces a new color, add a `--name` variable to
   the same file (and finally declare the existing-but-undeclared ones — §11).
3. **Default to embedding markup directly** in the relevant HTML file. Only
   reach for a JS factory in `src/` when the component is dynamic (data-driven
   list, stateful interaction) — match `createCarousel`'s factory shape.
4. **Always run `npm test`** before pushing. If you change `src/`, add or
   update a test in `tests/`.
5. **Do not introduce a build step, framework, or dependency** to make a
   design easier to port. If a design genuinely requires it, raise the
   question explicitly before changing the toolchain.

---

## 9. Code Connect

No Code Connect mappings exist yet (`get_code_connect_map` would return an
empty set). If we add them later, the natural anchors are:

- The `createCarousel` factory and the card markup it builds
  (`src/carousel.js:28-51`).
- The `.btn` / `.btn-solid` button rules in `index.html`.
- The remote-control button system in `remote.html` (`.remote`,
  `.power-btn`, etc.).

Until a real component library exists, prefer documenting class names and
factory APIs in this file over shipping Code Connect mappings that point at
ad-hoc HTML.

---

## 10. Conventions Summary

| Area              | Rule                                                              |
| ----------------- | ----------------------------------------------------------------- |
| Framework         | None — vanilla JS modules, no build step                          |
| Styling           | Per-page `<style>` block, plain class selectors                   |
| Tokens            | CSS custom properties named `--gold`, `--navy`, etc.              |
| Components        | Factory functions in `src/`, IDs in HTML for hooks                |
| Data              | Default-exported plain object arrays in `src/`                    |
| Tests             | Vitest + jsdom, files in `tests/`, mirror `src/`                  |
| Icons             | Unicode glyphs first, inline SVG when needed                      |
| Images            | Hot-linked Unsplash URLs with `?w=...&q=...`                      |
| Responsive        | `@media (max-width: 768px)` + `clamp()` for type                  |
| Commits           | Conventional Commits (`feat:`, `fix:`, `chore:`, ...)             |

---

## 11. Known issues to fix when porting designs

- **`index.html` references undeclared CSS variables.** `var(--navy)`,
  `var(--gold)`, `var(--gray)`, `var(--border)`, etc. are used everywhere but
  never defined in `:root`. Browsers fall back to the initial value, which is
  why the rendered page looks unstyled in those areas. Any Figma port should
  declare them at the top of the `<style>` block.
- **`index.html` markup is structurally broken.** The carousel block
  (`<div class="wrapper">…</div>`) is interleaved with a separate lawyer
  landing page (`<nav>`, `#hero`, `#about`, `#oblasti`, `#kontakt`) and the
  closing tags don't pair up cleanly (a `<nav>` opens inside a
  `<div class="nav">`, sections are nested inside the carousel container).
  Fix the structure before adding new sections from Figma — otherwise the new
  content will inherit the broken nesting.
- **Two divergent styles in one repo.** `index.html` (gold/navy, serif
  display) and `remote.html` (purple gradient, system font) share no tokens.
  Confirm which surface a Figma design targets before unifying anything.
