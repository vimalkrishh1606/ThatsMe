# Portfolio — Vimaleshwar K K

A 3D portfolio site built from `~/resume.md`. React + Vite, with a WebGL background
(three.js / react-three-fiber) and CSS-3D interaction throughout.

## Run

```bash
npm install     # already done
npm run dev     # http://localhost:5173
npm run build   # → dist/
npm run preview # serve the production build
```

## Editing content

**All copy lives in `src/data/resume.js`** — nothing is hardcoded in components. Update that
file when the résumé changes and every section follows.

| Export | Drives |
|---|---|
| `profile` | Name, role, tagline, email, social links |
| `stats` | The four figures under the hero |
| `experience` | Three roles, each with an array of `work` cards (`title`, `tag`, `short`, `full`) |
| `skills` | The six skill-category cards |
| `orbitSkills` | Labels on the rotating 3D sphere |
| `projects`, `education` | Their own sections |

Each work card shows `short` by default and expands to `full` (the verbatim résumé bullet)
on click — so the page stays skimmable but the full detail is one tap away.

## The 3D

**WebGL layer** (`components/Scene3D.jsx`) — a wireframe icosahedron core, a 1,400-point
depth-distributed starfield with additive blending, and a camera that lerps toward the pointer
so the whole scene parallaxes. Lazy-loaded, so the page paints before three.js arrives.

**CSS-3D** — `TiltCard.jsx` derives `rotateX/rotateY` from pointer position within the card and
lifts inner content on `translateZ`, giving real depth separation rather than a flat hover. A CSS
custom property feeds a radial sheen that tracks the cursor.

**Skill globe** (`components/Skills.jsx`) — tags placed on a sphere via the Fibonacci lattice,
positioned with `translate3d` inside a `preserve-3d` parent that spins on Y.

**Custom cursor** — a dot that tracks exactly plus a ring that lags and swells over interactive
elements.

## Accessibility & performance

- `prefers-reduced-motion` disables animation, drops the WebGL core and parallax, and thins the
  starfield.
- The WebGL layer is purely decorative and `pointer-events: none` — the site is fully readable
  and navigable if it never loads.
- Initial JS is ~53 kB gzipped; three.js is a deferred chunk.
- Custom cursor is disabled below 900px, where the native one returns.

## Deploying

Static output — `dist/` works on any host. `base: './'` is set in `vite.config.js`, so it also
works from a subpath (GitHub Pages project sites included).

```bash
npm run build && npx serve dist
```
