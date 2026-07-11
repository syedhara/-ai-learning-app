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
| Login page (stub, no real auth yet) | src/pages/LoginPage.js |
| Landing page (hub — links to puzzle, more features later) | src/pages/LandingPage.js |
| Puzzle page (thin wrapper around Crossword) | src/pages/PuzzlePage.js |
| Top-level layout, difficulty selector, hint mode selector | src/components/Crossword.js |
| All game state, effects, and logic (typing, checking, revealing) | src/hooks/useCrosswordGame.js |
| Grid rendering, action buttons, legend | src/components/CrosswordGrid.js |
| Across/Down clue panels | src/components/CrosswordClues.js |
| Runtime crossword generator algorithm | src/utils/generateCrossword.js |
| Which words appear in each difficulty puzzle | src/data/puzzleData.js |
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
  - Added `react-router-dom` (v6 — v7 breaks CRA5's Jest module resolution, see Key Decisions) with 3 routes: `/` (Login stub), `/home` (Landing hub), `/puzzle` (Crossword, unchanged internally)
  - Landing page links to the Crossword puzzle; more links/features get added here over time
  - Login page has no real auth yet — a Continue button just navigates to `/home`
  - Sets up the **Practice by Topic** idea: a future page where Sri picks Subject + Difficulty and gets a puzzle from just that slice (wordBank.json words already carry a `subject` tag for this)
- [ ] **Login page** — build out real functionality (current page is just a stub Continue button). Next up.
- [ ] **Practice by Topic** — separate puzzle page where Sri picks Subject + Difficulty and gets a puzzle from just that slice (wordBank.json words already carry a `subject` tag for this). Next up.
- [ ] **Admin section** — separate page to configure modes/settings (replacing hardcoded adminConfig.js)
- [ ] Additional items TBD after Sri's testing

**Next session (2026-07-08) — start here:**
1. Login page — real functionality
2. Practice by Topic — subject-based puzzle page

All work happens on the `staging` branch (PR #1: https://github.com/syedhara/-ai-learning-app/pull/1), not `main` — production stays untouched until we merge. Staging preview: https://ai-learning-app-git-staging-sri-y.vercel.app/

---

## What's Already Built (Sprint 1 — complete)

- Crossword grid (13×14), 10 beginner words, auto-advance cursor, arrow keys, clue panel
- 3 hint modes: Check Answers / Live Feedback / Reveal on Demand (Reveal Letter + Reveal Word)
- Admin config (`adminConfig.js`) to enable/disable modes per audience
- Colour-coded legend below grid
- wordBank.json — 79 terms: 29 beginner, 30 intermediate, 20 advanced (goal: grow to 300); each word tagged with `subject` for future topic filtering
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

---

## Deferred — Do Not Implement Yet

- **Mobile fix** — UI breaks on Samsung Galaxy S26 Ultra; keyboard doesn't pop up on cell tap
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
