# Naver CTR Baseline and SEO Audit

Date: 2026-07-29
Site: https://sudokuday.co.kr/
Scope: PR 0 baseline and metadata audit only.

## Search Baseline

Source: user-provided Naver Search Advisor recent 30-day data.

| Metric | Value |
| --- | ---: |
| Total clicks | 6 |
| Total impressions | 1,712 |
| Average CTR | 0.4% |
| Clicked landing page | `/` |

Visible query groups:

| Query group | Clicks | Impressions | CTR |
| --- | ---: | ---: | ---: |
| Medium intent: `스도쿠 중급 무료`, `스도쿠 중급 무료게임`, `스도쿠 중급 무료 게임` | 0 | 518 | 0% |
| General free-game intent shown in report | 6 | 716 | 0.8% |

Primary opportunity: improve `/medium/` as the representative landing page for medium-intent searches without creating a new page.

## PR 0 Guardrails

No changes were made to:

- Homepage title
- `/medium/` title
- URL or trailing slash policy
- Canonical policy
- `robots.txt`
- Meta robots
- Sitemap path
- H1 text
- AdFit configuration, units, placement, or count
- Sudoku game logic, puzzle generation, storage keys, or completion behavior

## Live Checks

Checked on 2026-07-29 from the local development environment and browser fetches.

| URL | Result |
| --- | --- |
| `https://sudokuday.co.kr/` | HTTP/2 200, title `무료 스도쿠 게임 - 오늘의 스도쿠 \| 스도쿠데이` |
| `https://sudokuday.co.kr/medium/` | HTTP/2 200, title `중급 스도쿠 무료 게임 \| 스도쿠데이` |
| `https://sudokuday.co.kr/robots.txt` | HTTP/2 200, `Allow: /`, sitemap points to `https://sudokuday.co.kr/sitemap.xml` |
| `https://sudokuday.co.kr/sitemap.xml` | HTTP/2 200, contains 8 canonical URLs on `https://sudokuday.co.kr/` |
| `https://sudokuday.co.kr/og-default.png` | HTTP/2 200, `image/png`, served size 17,652 bytes |

Live `/medium/` source confirms:

- one `<title>`: `중급 스도쿠 무료 게임 | 스도쿠데이`
- one meta description
- self canonical: `https://sudokuday.co.kr/medium/`
- meta robots: `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`
- `og:url` equals canonical
- common `og:image`: `https://sudokuday.co.kr/og-default.png`
- initial HTML contains H1, first paragraph, game controls, and real internal `<a href>` links

## Local Build Audit

Commands run:

```bash
npm run build
npm run test:legacy
npm run test:dist
```

Results:

- Build succeeded and generated `dist/`.
- Legacy brand and previous host scan passed.
- SEO metadata validation passed for 8 pages.

## Metadata Findings

See `page-metadata-inventory.csv` for the route-level inventory.

Current good state:

- All 8 indexable routes have exactly one title.
- All 8 indexable routes have exactly one H1.
- All 8 indexable routes have unique descriptions.
- All canonical URLs are self-referential and use `https://sudokuday.co.kr/`.
- All `og:url` values match canonical URLs.
- All 8 indexable routes are included in the sitemap.
- Sitemap URLs and canonical URLs use matching trailing slashes.
- No `noindex` was found on indexable routes.
- Manifest name, short name, JSON-LD site name, RSS title, OG site name, and Apple web app title use `스도쿠데이`.

Items intentionally left for later PRs:

- All pages currently share `https://sudokuday.co.kr/og-default.png`; `/medium/` should receive a dedicated OG image in the separate OG-image PR.
- `/medium/` first paragraph exists in initial HTML, but does not yet include the full feature set from the specification.
- Feature summary badges do not yet exist under the `/medium/` H1.
- Several medium links use short anchors such as `중급`, `중급 스도쿠`, or `중급 스도쿠로 이동`; full natural anchors are a separate internal-link PR.
- Homepage first paragraph is not changed in PR 0.

## Sitemap Findings

Live and local sitemap include:

```text
https://sudokuday.co.kr/
https://sudokuday.co.kr/easy/
https://sudokuday.co.kr/medium/
https://sudokuday.co.kr/hard/
https://sudokuday.co.kr/guide/rules/
https://sudokuday.co.kr/guide/strategy/
https://sudokuday.co.kr/about/
https://sudokuday.co.kr/privacy/
```

All `lastmod` values are currently `2026-07-28`. Future SEO-visible PRs should update `lastmod` only for routes whose visible content or metadata actually changes.

## Recommended Next PR Sequence

1. PR 1: no code change unless a legacy brand/domain conflict appears in another surface.
2. PR 2: update `/medium/` first paragraph, add feature summary badges, and strengthen medium-related internal anchor text.
3. Observe 14-28 days before the next SEO-visible page metadata experiment.
4. PR 3: add `/medium/` dedicated OG image only.
5. Later: consider `/medium/` description and title single-variable experiments only after the specified observation and CTR conditions are met.
