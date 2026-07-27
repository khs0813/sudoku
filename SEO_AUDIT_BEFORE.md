# SEO Audit Before

Date: 2026-07-28 KST

## Scope

- Checked source files, current `dist` output, JSON-LD, Open Graph, Twitter Card metadata, manifest, service worker generation, share text, footer, about/privacy pages, sitemap, robots, README, Render config, and tracked IDE module metadata.
- `rg` was unavailable in this shell, so repository searches used `grep`/`find`.
- No precompressed `.gz` or `.br` artifacts were found.

## URL Inventory

The existing indexable URL set is present and should be preserved:

- `/`
- `/easy/`
- `/medium/`
- `/hard/`
- `/guide/rules/`
- `/guide/strategy/`
- `/about/`
- `/privacy/`
- `/robots.txt`
- `/sitemap.xml`

## Metadata Findings

- `BaseLayout.astro` emits one title, one meta description, one canonical, one Open Graph title/description/url/image set, and matching Twitter Card fields for pages using the layout.
- Canonical and Open Graph URLs resolve from Astro `site`, with the configured fallback host `https://sudokuday.co.kr`.
- JSON-LD currently uses the current brand name and canonical site URL.
- Page titles already match the approved titles for the eight normal pages.
- Several page descriptions do not match the approved descriptions:
  - `/`
  - `/easy/`
  - `/medium/`
  - `/hard/`
  - `/guide/rules/`
  - `/guide/strategy/`
- `/about/` and `/privacy/` have unique descriptions, but they can be made more specific and less formulaic.

## Branding And Host Findings

Exact legacy hits were found before changes in:

- `package.json` and `package-lock.json`: old package name.
- `render.yaml`: old service name.
- `scripts/generate-sw.mjs` and `dist/sw.js`: old service worker cache prefix.
- `public/js/sudoku-game.js` and `dist/js/sudoku-game.js`: legacy localStorage key prefix and old Korean hash seed.
- `README.md`: legacy localStorage prefix documentation.
- `public/js/adfit-loader.js` and `dist/js/adfit-loader.js`: previous Render host suffix was present only as an ad-blocking condition.
- `.idea/modules.xml`: tracked IDE module path references the old module filename.
- Ignored local IDE workspace metadata also contains the local repository path; this should be excluded from SEO/source artifact scans.

## PWA Findings

- `manifest.webmanifest` has current `name` and `short_name`.
- `manifest.webmanifest` has `start_url` and `scope`, but no explicit `id`.
- The service worker cache prefix still uses the old package/brand token.
- The generated service worker deletes non-current caches on activation, which will clear previous HTML caches when the cache name changes.

## Puzzle And Analytics Findings

- Puzzle data is static in `public/data/sudoku.json` with 20 puzzles each for easy, medium, and hard.
- No automated puzzle validation script currently exists in `package.json`.
- Current tests only cover AdFit configuration.
- No game start, completion, or return-visit analytics events are currently emitted.

## Planned Remediation

- Keep all existing URLs and indexability.
- Update page descriptions to approved text and keep Open Graph/Twitter fields derived from the same values.
- Add explicit manifest `id`.
- Replace source-visible legacy identifiers with current-brand identifiers while migrating old localStorage data without deleting it.
- Change the service worker cache prefix so previous HTML caches stop serving.
- Add puzzle validation covering single solution, givens/solution consistency, difficulty clue ranges, and deterministic daily selection.
- Add GA/dataLayer-compatible events for game start, puzzle completion, and return visits.
- Delete and regenerate `dist` before final build.
