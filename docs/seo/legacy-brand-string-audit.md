# Legacy Brand String Audit

Date: 2026-07-29
Scope: PR 0 audit of previous branding and previous deployment hosts.

## Result

No legacy brand or previous host strings were found in the scanned project files.

## Commands

```bash
npm run test:legacy
```

Manual `git grep` checks returned no matches for the legacy Korean spaced brand, legacy Korean compact brand, legacy English spaced brand, legacy package slug, and legacy hosted-domain token. The same check set is encoded in `scripts/check-legacy-strings.mjs`. `npm run test:legacy` passes after this report avoids repeating the blocked strings.

## Checked Surfaces

| Surface | Current value |
| --- | --- |
| Site name | `스도쿠데이` |
| Site short name | `스도쿠데이` |
| Fallback URL | `https://sudokuday.co.kr` |
| `og:site_name` | `스도쿠데이` |
| JSON-LD `WebSite.name` | `스도쿠데이` |
| JSON-LD `VideoGame.name` | `스도쿠데이` |
| Manifest `name` | `스도쿠데이` |
| Manifest `short_name` | `스도쿠데이` |
| Apple web app title | `스도쿠데이` |
| RSS channel title | `스도쿠데이` |
| Service worker cache prefix | `sudokuday-` |

## Notes

- The repository directory still uses the historical project slug, but no tracked source or generated user-visible metadata contains the old brand token.
- Existing `.idea` workspace changes were present before this audit and were not modified.
- No service-worker cache bump is needed in PR 0 because no stale legacy HTML cache name or legacy brand string was found.
