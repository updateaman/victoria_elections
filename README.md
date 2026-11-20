# victoria_elections

A neutral, source-linked comparison of party pledges for the 2026 Victorian state election, published via GitHub Pages.

See [PLAN.md](PLAN.md) for the project plan and task breakdown.

## Development

Requires Node.js 22.23+.

```sh
npm install
npm run dev       # local dev server at http://localhost:4321
npm run build     # build static site to dist/ (also validates all data)
npm run preview   # preview the built site
```

## Data

All content lives in `src/data/` and is validated against the schemas in `src/content.config.ts` on every build.

| File | Contents |
|---|---|
| `src/data/parties.json` | Array of parties: `id`, `name`, `shortName`, `colour`, `website`, `manifestoUrl`, `lastVerified`, ... |
| `src/data/candidates.json` | Featured people: `id`, `name`, `partyId`, Victorian role or electorate, short biography, source and photo credit. Store licensed headshots at `public/candidates/<id>.jpg`, or set `portraitUrl` for a hosted portrait. |
| `src/data/topics.json` | Fixed topic taxonomy shared across the site |
| `src/data/pledges/<party-id>.json` | Array of pledges for one party |

Example pledge:

```json
{
  "id": "labor-health-001",
  "party": "labor",
  "topic": "health",
  "title": "Short neutral title",
  "summary": "Neutral one–two sentence summary of what is pledged.",
  "costing": "$100m over 4 years",
  "sourceUrl": "https://example.org/policy",
  "sourceTitle": "Party policy page title",
  "excerpt": "Optional verbatim quote from the source.",
  "dateAccessed": "2026-11-20"
}
```

Rules: every pledge needs a source URL and access date; IDs must be unique and stable; `party` and `topic` must match existing IDs; dates use `YYYY-MM-DD`.

## Deployment

Pushes to `main` deploy automatically via `.github/workflows/deploy.yml`. `site` and `base` are derived from the GitHub repository name at build time (override with `SITE_URL` / `BASE_PATH` env vars, e.g. for a custom domain).

One-time setup: in the GitHub repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.
