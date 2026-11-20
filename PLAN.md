# Victorian State Election 2026 – Manifesto Comparison Site

**Repo:** `C:\Users\DorkKnight\Documents\GitHub\updateaman\victoria_elections`
**Election day:** Saturday 28 November 2026
**Goal:** A neutral, source-linked website (Astro on GitHub Pages) comparing party pledges, later extended with track records and a Q&A assistant.

## Decisions

| Area | Decision |
|---|---|
| Parties | Labor, Liberal, Nationals, Greens + ~4–6 notable minor parties |
| Tech | Astro static site, GitHub Actions → GitHub Pages |
| Depth | Neutral summary + costing (if stated) + source link per pledge |
| Deadline | Phases 1–3 live before 28 Nov; Phases 4–5 after (5A possibly before) |
| Neutrality | No scoring/ranking; every claim sourced; "last verified" dates shown |

## Guiding principles

- Every pledge / record entry has at least one source URL and an access date.
- Neutral, factual wording; quote rather than characterise where possible.
- Stable IDs for parties, topics, pledges and sources (needed by Phases 4–5).
- One shared topic taxonomy across all phases.
- Keep raw manifesto text excerpts alongside summaries (needed for the chatbot).

---

## Phase 0 – Setup (Day 1)

- [x] 0.1 Scaffold Astro project in repo root (TypeScript, minimal template)
- [x] 0.2 Add `.gitignore`, update `README.md` (purpose, how to contribute/update data)
- [x] 0.3 Configure `astro.config.mjs` with `site` and `base` for GitHub Pages (derived from `GITHUB_REPOSITORY`)
- [x] 0.4 Add `.github/workflows/deploy.yml` (build + deploy on push to `main`)
- [ ] 0.5 Create GitHub remote + push; enable Pages (Source: GitHub Actions); verify placeholder deploys
- [x] 0.6 Define data schemas in `src/content.config.ts` (Astro content collections + Zod):
  - `parties`: `{ id, name, shortName, colour, logo?, website, manifestoUrl, manifestoPdf?, archiveUrl?, lastVerified, limitedInformation, notes?, order }`
  - `topics`: `{ id, name, description, order }`
  - `pledges`: `{ id, party, topic, title, summary, costing?, costingSource?, sourceUrl, sourceTitle, archiveUrl?, excerpt?, announcedDate?, dateAccessed }` – one JSON array file per party in `src/data/pledges/`
- [x] 0.7 Create `src/data/topics.json` with the fixed taxonomy:
  Health, Housing, Cost of Living, Transport, Education, Environment & Energy, Crime & Justice, Economy & Tax, Integrity, Other

## Phase 1 – Research & data collection (Days 1–3)

- [ ] 1.1 Confirm registered parties contesting (VEC register / candidate lists); finalise list of minor parties
- [ ] 1.2 For each party, record official website, policy page, manifesto PDF → `parties.json`
- [ ] 1.3 Archive source pages (save PDFs / Wayback Machine snapshot links) in case they change
- [ ] 1.4 Extract pledges – one task per party:
  - [ ] 1.4a Labor
  - [ ] 1.4b Liberal
  - [ ] 1.4c Nationals (note joint Coalition policies)
  - [ ] 1.4d Greens
  - [ ] 1.4e–j Minor parties (one each)
- [ ] 1.5 Capture costings where stated (incl. PBO costings if published)
- [ ] 1.6 Store raw manifesto excerpts per pledge (for quoting + chatbot)
- [ ] 1.7 QA pass: check every link works, summaries are neutral, topics are consistent, no duplicates
- [ ] 1.8 Flag parties with limited published policy ("limited information" note)

## Phase 2 – Website build (Days 3–5)

- [ ] 2.1 Base layout: header/nav, footer (authorisation line, last-updated, disclaimer)
- [ ] 2.2 Party colour/badge component; pledge card component (summary, costing, source link)
- [ ] 2.3 Home page: intro, party grid with direct manifesto links, topic shortcuts
- [ ] 2.4 Party pages `/parties/[id]`: pledges grouped by topic
- [ ] 2.5 Topic pages `/topics/[id]`: all parties' pledges on that topic side by side
- [ ] 2.6 Compare page `/compare`: topic × party matrix with party picker (2–4 parties)
- [ ] 2.7 Client-side search/filter (keyword, party, topic) – e.g. Pagefind or Fuse.js
- [ ] 2.8 About page: methodology, sources, neutrality statement, how to report errors (GitHub issue link)
- [ ] 2.9 Responsive / mobile check; accessibility (contrast, keyboard nav, alt text)
- [ ] 2.10 SEO/sharing: page titles, meta descriptions, Open Graph image

## Phase 3 – Launch (Days 5–6)

- [ ] 3.1 Check authorisation requirements with VEC; add authorisation statement to footer
- [ ] 3.2 Automated link check across all source URLs
- [ ] 3.3 Final neutrality review of all summaries
- [ ] 3.4 Deploy to production; smoke-test live site on desktop + mobile
- [ ] 3.5 Add "Report an error" issue template
- [ ] 3.6 Pre-election refresh: re-check parties for new announcements (until 27 Nov)

## Phase 4 – Track record (post-launch)

- [ ] 4.1 Define schema `records`: `{ id, partyId, topicId, date, category, title, summary, status?, sources[] }`
  - categories: `legislation`, `vote`, `budget`, `promise-2022`, `independent-finding`, `controversy`
  - status (promises): `delivered`, `partially-delivered`, `not-delivered`, `abandoned`, `in-progress`
- [ ] 4.2 Scope: 2018–present; document methodology (note governing vs non-governing parties)
- [ ] 4.3 2022 promise tracker: collect each major party's 2022 pledges, assess status with sources
- [ ] 4.4 Legislation & recorded votes from Parliament of Victoria bills DB / Hansard divisions
- [ ] 4.5 Budget measures from Victorian Budget papers
- [ ] 4.6 Independent findings: VAGO, IBAC, Ombudsman reports
- [ ] 4.7 Notable controversies from reputable media (attributed, linked, no editorialising)
- [ ] 4.8 UI: "Track record" section on party pages; promise-tracker page; link records to topics
- [ ] 4.9 Add "pledge vs record" view on topic pages
- [ ] 4.10 Neutrality + source QA pass

## Phase 5 – Q&A assistant

### 5A – In-browser semantic search (no server, free)
- [ ] 5A.1 Chunk pledges + manifesto excerpts + records into retrievable passages
- [ ] 5A.2 Build-time script: generate embeddings → static JSON index
- [ ] 5A.3 In-browser query embedding with transformers.js (small model, e.g. MiniLM)
- [ ] 5A.4 "Ask" page: question box → top matching pledges quoted with party, topic, source link
- [ ] 5A.5 Disclaimer: answers are excerpts from party materials; not voting advice
- [ ] 5A.6 Test with a set of sample questions; tune chunking/thresholds

### 5B – LLM answers via proxy (optional, if demand)
- [ ] 5B.1 Cloudflare Worker proxy holding API key
- [ ] 5B.2 Retrieval-grounded prompt: answer only from retrieved passages, cite sources, refuse voting recommendations/rankings
- [ ] 5B.3 Rate limiting, abuse protection, spend cap
- [ ] 5B.4 Evaluation set for accuracy and neutrality; red-team prompts
- [ ] 5B.5 UI: conversational answers with inline citations, fallback to 5A results

---

## Proposed repo structure

```
victoria_elections/
├─ .github/workflows/deploy.yml
├─ public/                     # logos, OG image, embeddings index (Phase 5)
├─ scripts/                    # link checker, embedding builder
├─ src/
│  ├─ content/ or data/
│  │  ├─ parties.json
│  │  ├─ topics.json
│  │  ├─ pledges/<party>.json
│  │  └─ records/<party>.json  # Phase 4
│  ├─ components/
│  ├─ layouts/
│  └─ pages/
│     ├─ index.astro
│     ├─ compare.astro
│     ├─ about.astro
│     ├─ ask.astro             # Phase 5
│     ├─ parties/[id].astro
│     └─ topics/[id].astro
├─ astro.config.mjs
└─ README.md
```

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Late policy announcements | "Last verified" dates; refresh task 3.6 |
| Minor parties lack platforms | "Limited information" label rather than omission |
| Perceived bias | Neutral wording, sources for everything, methodology page, error-report link |
| Broken/changed source links | Archive snapshots (1.3), link checker (3.2) |
| Electoral authorisation rules | Check with VEC; footer authorisation (3.1) |
| Chatbot misstatements | 5A first (extractive only); strict grounding + citations for 5B |
