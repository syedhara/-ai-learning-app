# CLAUDE.md — AI Learning App

**Read this file first every session before touching any code.**
**For full feature specs, decision history, and backlog → see [PRODUCT.md](PRODUCT.md)**

---

## Project Overview

**Name:** AI Learning App
**Goal:** Help people learn AI concepts through interactive crossword puzzles
**Owner:** Sri (Tech Manager, US-based) — developer background until 2015 (VB, C++, C#, SQL); Claude writes the code for this project
**GitHub:** https://github.com/syedhara/-ai-learning-app
**Vercel:** https://vercel.com/sri-y/ai-learning-app
**Vercel Staging:** https://ai-learning-app-git-staging-sri-y.vercel.app/
**Local path:** /Users/sriyedhara/project_hyd/ai-learning-app/

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (JavaScript) |
| Routing | react-router-dom v6 |
| Styling | Plain CSS |
| Hosting | Vercel (free tier, auto-deploys on git push) |
| Version Control | GitHub |
| Backend / DB | None yet — all data lives in src/data/ |

---

## Coding Guidelines

- **Comment the code** — Sri is non-technical; explain what each section does in plain English
- **Keep it simple** — no over-engineering
- **One thing at a time** — small, testable changes per session
- **Mobile-friendly** — responsive design from the start

---

## File Map — What to Read for Each Task

| If the task is about… | Read this file |
|-----------------------|----------------|
| Page routes (Login → Landing → Puzzle) | src/App.js |
| Login page (name required; shows stats for returning users) | src/pages/LoginPage.js |
| Landing page (hub — links to puzzle, more features later) | src/pages/LandingPage.js |
| Puzzle page (thin wrapper around Crossword) | src/pages/PuzzlePage.js |
| Top-level layout, difficulty selector, hint mode selector | src/components/Crossword.js |
| All game state, effects, and logic (typing, checking, revealing, fresh-word rotation, stats recording, word-review gate) | src/hooks/useCrosswordGame.js |
| Word review (flashcards) screen shown before the grid | src/components/WordReview.js |
| Grid rendering only | src/components/CrosswordGrid.js |
| Action buttons (mode buttons, Need Help, Reveal sub-buttons) — own grid area so mobile can reorder it below the clues | src/components/CrosswordActions.js |
| Across/Down clue panels | src/components/CrosswordClues.js |
| Runtime crossword generator algorithm | src/utils/generateCrossword.js |
| Local profile + stats (localStorage: name, seen words, attempted/correct, per-subject accuracy) | src/utils/progress.js |
| Which words are eligible per difficulty (now the full wordBank.json list per level, not a fixed pick) | src/data/puzzleData.js |
| Words, clues, difficulty levels, multi-word terms | src/data/wordBank.json |
| Feature flags (enable/disable hint modes) | src/data/adminConfig.js |
| All styling | src/App.css |
| Browser tab title | public/index.html |

---

## First Edition — SHIPPED ✅ (2026-06-30)

Sprint 2 and styling complete. Live on Vercel. Sri is testing.

**What's in the first edition:**
- Difficulty selector (Beginner / Intermediate / Advanced), runtime grid generation
- Multi-word terms (DEEP LEARNING, CONTEXT WINDOW) with break markers
- Pastel green design — centered title/tagline, action bar below grid, legend removed
- Code split: Crossword.js → 4 focused files + 1 hook

---

## Next Sprint — Sprint 4 (in progress)

- [x] **App flow / navigation restructure** — Login page (stub) → Landing page → Puzzle page. Done 2026-07-07.
  - Added `react-router-dom` (v6 — v7 breaks CRA5's Jest module resolution, see Key Decisions) with 3 routes: `/` (Login), `/home` (Landing hub), `/puzzle` (Crossword, unchanged internally)
  - Landing page links to the Crossword puzzle; more links/features get added here over time
  - Sets up the **Practice by Topic** idea: a future page where Sri picks Subject + Difficulty and gets a puzzle from just that slice (wordBank.json words already carry a `subject` tag for this)
- [x] **Mobile fixes** — done 2026-07-12, live on `main`.
  - Grid overflow fixed: cell size now driven by a CSS custom property (`--cell-size`) set via media queries instead of an inline JS pixel value, so the grid tracks and `.cell` boxes can't disagree
  - Grid now fills the full width of the white puzzle card on mobile (fluid `1fr` columns + `aspect-ratio: 1` cells) instead of leaving unused white space
  - Mobile layout reordered — grid, then clues, then action buttons (was grid+buttons, then clues) via CSS `grid-template-areas` on `.puzzle-layout`; action buttons split out of `CrosswordGrid.js` into `CrosswordActions.js` so each block is its own grid item. Desktop layout unchanged.
  - Beginner/Intermediate/Advanced level buttons now fit on one row on phones instead of the third wrapping
- [x] **Word bank grown to 179 terms** (was 79) — done 2026-07-12, live on `main`. `puzzleData.js` now passes the *full* per-difficulty word list into the generator instead of a fixed 29-word pick, so puzzles draw from a much larger, varying pool. See Key Decisions for the pool-size-vs-placement-result bug found while verifying this.
- [x] **Login page — real functionality** — done 2026-07-12, currently on `staging` only (not yet merged to `main`).
  - Local profile only — a required name, no password, no backend (see Key Decisions and `src/utils/progress.js`)
  - Returning users see a stats card instead of the name field: overall attempted/correct + per-subject accuracy (using the `subject` tags already on every word)
  - Puzzles now avoid repeating words already shown per difficulty ("fresh words"), recycling once a level's pool would otherwise produce a sparse puzzle
- [x] **Word review (flashcards) before the grid** — done 2026-07-18.
  - Testers with no prior AI vocabulary couldn't complete even one puzzle — the hint modes all assume you already know the word and need to recall it, but new vocabulary has nothing to recall
  - New puzzle now opens on a flashcard-style review screen (`src/components/WordReview.js`) listing the exact words that got placed in *this* puzzle (clue + subject tag; tap the card to reveal/hide the word), with Prev/Next navigation and a "Skip review" link for repeat players
  - `useCrosswordGame.js` gates the grid behind a new `reviewing` state — true on every fresh puzzle (difficulty switch or reload), cleared by a "Start Puzzle" button
- [ ] **Practice by Topic** — separate puzzle page where Sri picks Subject + Difficulty and gets a puzzle from just that slice (wordBank.json words already carry a `subject` tag for this). Next up.
- [ ] **Admin section** — separate page to configure modes/settings (replacing hardcoded adminConfig.js)
- [ ] Additional items TBD after Sri's testing

**Next session — start here:**
1. Merge the Login/local-profile work from `staging` to `main` once Sri's happy with it
2. Practice by Topic — subject-based puzzle page
3. Cross-device backend — still undecided (see Deferred)

All work happens on the `staging` branch (PR #1: https://github.com/syedhara/-ai-learning-app/pull/1), not `main` — production stays untouched until we merge. Staging preview: https://ai-learning-app-git-staging-sri-y.vercel.app/

---

## What's Already Built (Sprint 1 — complete)

- Crossword grid (13×14), 10 beginner words, auto-advance cursor, arrow keys, clue panel
- 3 hint modes: Check Answers / Live Feedback / Reveal on Demand (Reveal Letter + Reveal Word)
- Admin config (`adminConfig.js`) to enable/disable modes per audience
- Colour-coded legend below grid
- wordBank.json — 179 terms: 62 beginner, 64 intermediate, 53 advanced (goal: grow to 300); each word tagged with `subject` for future topic filtering
- Difficulty selection persists across browser refresh (localStorage)
- Title: "Learn AI · Crossword"
- "Need Help" button (opt-in, one-time per puzzle) reveals 12% of the grid as locked, Sudoku-style starting letters — helps first-timers get a foothold on unfamiliar terms. See PRODUCT.md.

---

## Key Decisions

- **wordBank.json is the single source of truth** for all words and clues — never hardcode words elsewhere
- **adminConfig.js** controls which hint modes are visible (useful for classroom vs casual settings)
- **Multi-word terms:** stored without the space in the grid (e.g. MACHINELEARNING as one run of cells), with a visual break marker between words and "(2 words)" in the clue
- **Word bank sources:** bfortuner/ml-glossary (MIT licence) + holasoymalva/llm-glossary (open source)
- **react-router-dom pinned to v6, not v7:** v7's package.json `exports` map isn't resolvable by CRA5's Jest setup (`Cannot find module 'react-router/dom'`), and CRA doesn't allow easy Jest config overrides. v6 has everything this app needs (basic routes, `Link`, `useNavigate`) without the incompatibility.
- **Mobile grid sizing:** cell size is a CSS custom property (`--cell-size`) driven by media queries, never an inline JS pixel value — inline styles can't be overridden by a media query, which is exactly what broke the grid on phones originally. On mobile the grid uses fluid `1fr` columns + `aspect-ratio: 1` cells instead of a fixed size, so it always fills the card width.
- **Login/stats is local-only, not real accounts:** just a required name (no password) with everything — seen words, attempted/correct, per-subject accuracy — stored in `localStorage` via `src/utils/progress.js`. Chosen over real accounts to avoid building this app's first-ever backend before it's clear it's needed. Tradeoff: stats don't sync across devices/browsers — revisit if that starts to matter (see Deferred).
- **"Correct" = solved unaided:** a word only counts as correct in stats if none of its cells were ever touched by Reveal Letter, Reveal Word, or Need Help. Assisted words still count as *attempted*, just not *correct*.
- **Fresh-word recycling triggers on placement result, not pool size:** originally recycled (cleared seen-words) once a difficulty's *remaining* pool dropped below a size threshold — testing showed this could still hand the generator ~20 words that just didn't intersect well, placing almost nothing. Now it recycles whenever the actual `placed.length` comes back too low, regardless of how big the input pool was.

---

## Deferred — Do Not Implement Yet

- **Cross-device backend** — local profile/stats (see Key Decisions) only track one device/browser today. Sri is still deciding whether/what to build; wants to stay on the free tier. Options discussed: (a) a serverless function reading/writing a JSON file in a GitHub repo via the GitHub API — free, but fragile (multi-second latency, no real concurrency protection); (b) a proper free-tier database (Supabase, Firebase) — built for this, still free at this app's scale. No decision made yet — don't build either without Sri picking a direction first.
- **Reveal limits** — cap how many letters/words can be revealed per session
- **Topic selector** — superseded by the Practice by Topic page idea above (see Sprint 4) — wordBank.json words already carry a `subject` tag (LLM, Prompt Engineering, Machine Learning, NLP, AI Ethics & Safety, AI Agents) ready for this
- **Expert level** — needs larger grid; REINFORCEMENT and HYPERPARAMETER reserved for it

---

## Useful Commands

```bash
npm start           # Start local dev server
npm run build       # Build for production
git add .           # Stage all changes
git commit -m "…"   # Commit with a message
git push            # Push to GitHub — Vercel auto-deploys
```
