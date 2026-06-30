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
**Local path:** /Users/sriyedhara/project_hyd/ai-learning-app/

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (JavaScript) |
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

## Active Sprint — Sprint 2 ✅ COMPLETE

- [x] **Difficulty level selector** — Beginner / Intermediate / Advanced toggle; runtime generator runs on each switch
- [x] **Multi-word terms** — DEEPLEARNING + CONTEXTWINDOW in wordBank.json with breakAfter; thick break-marker bar on grid; clue says "(2 words)"
- [x] **Runtime generation (Option 2)** — grid generated in browser on page load; no more hardcoded positions in puzzleData.js
- [x] **Code split** — Crossword.js split into 4 focused files; File Map updated above

---

## What's Already Built (Sprint 1 — complete)

- Crossword grid (13×14), 10 beginner words, auto-advance cursor, arrow keys, clue panel
- 3 hint modes: Check Answers / Live Feedback / Reveal on Demand (Reveal Letter + Reveal Word)
- Admin config (`adminConfig.js`) to enable/disable modes per audience
- Colour-coded legend below grid
- wordBank.json — 45 terms: 18 beginner, 17 intermediate, 10 advanced
- Title: "Learn AI · Crossword"

---

## Key Decisions

- **wordBank.json is the single source of truth** for all words and clues — never hardcode words elsewhere
- **adminConfig.js** controls which hint modes are visible (useful for classroom vs casual settings)
- **Multi-word terms:** stored without the space in the grid (e.g. MACHINELEARNING as one run of cells), with a visual break marker between words and "(2 words)" in the clue
- **Word bank sources:** bfortuner/ml-glossary (MIT licence) + holasoymalva/llm-glossary (open source)

---

## Deferred — Do Not Implement Yet

- **Mobile fix** — UI breaks on Samsung Galaxy S26 Ultra; keyboard doesn't pop up on cell tap
- **Reveal limits** — cap how many letters/words can be revealed per session
- **User accounts** — login, progress tracking
- **Topic selector** — let user pick a topic (LLMs, Prompts, etc.) not just difficulty

---

## Useful Commands

```bash
npm start           # Start local dev server
npm run build       # Build for production
git add .           # Stage all changes
git commit -m "…"   # Commit with a message
git push            # Push to GitHub — Vercel auto-deploys
```
