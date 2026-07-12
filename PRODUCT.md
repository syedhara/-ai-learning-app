# PRODUCT.md — AI Learning App

**This is the permanent product record.**
Read this when: testing a feature, pruning CLAUDE.md, revisiting a past decision, or onboarding someone new.
Do NOT read this at the start of every session — use CLAUDE.md for that.

---

## Table of Contents

1. [Feature Specs](#feature-specs)
2. [Decision Log](#decision-log)
3. [Backlog & Future Ideas](#backlog--future-ideas)

---

## Feature Specs

These describe exactly what each built feature is supposed to do. Use this for testing.

---

### Crossword Grid & Gameplay

- Grid is 13 rows × 14 columns
- 10 AI terms per puzzle (Beginner level in Sprint 1)
- Words intersect at shared letters (standard crossword rules)
- Click a cell to select it; click the same cell again to toggle Across ↔ Down
- Type a letter to fill the cell; cursor auto-advances to the next cell in the current direction
- Backspace clears the current cell; if already empty, moves back and clears the previous cell
- Arrow keys navigate across the grid
- Clicking a clue in the clue panel jumps to that word's first cell
- Active word is highlighted in blue; the selected cell is a darker blue

---

### Hint & Check System — 3 Modes

Users choose how much help they want. A mode selector is shown at the top of the puzzle.
Default mode: **Check Answers**. User can switch modes at any time.
If only one mode is enabled by admin, the selector is hidden.

#### Mode 1 — Check Answers (Final Check)
- User fills in the entire puzzle, then clicks "Check Answers"
- Correct cells turn **green**, wrong cells turn **red**
- Empty cells are ignored (no colour, no penalty)
- If everything is correct, a congratulations banner appears
- Typing again clears the colour feedback
- Good for: confident learners who want no hints during play

#### Mode 2 — Live Feedback (Check as You Type)
- The moment a letter is typed, the cell immediately turns green or red
- No button needed — feedback is instant
- Good for: learners who want real-time reinforcement

#### Mode 3 — Reveal on Demand
Two sub-options:
- **Reveal Letter** — fills in just the currently selected cell with the correct answer
- **Reveal Word** — fills in all cells of the currently selected word
- User can reveal at any time, no restrictions (reveal limits are a future feature)
- Good for: beginners who get stuck and want to learn by seeing the answer

---

### Need Help — On-Demand Starting Letters (Sudoku-style hints)

- Grid loads with **no letters revealed**. A "Need Help" button in the action bar (caption: "Reveal some random letters") lets the user opt in
- Clicking it once reveals `adminConfig.prefillPercentage` (default 12%) of the grid's still-blank filled cells, randomly chosen
- One-time per puzzle — the button disappears after use; a new puzzle (difficulty switch or reload) resets it
- Revealed cells are locked — can't be typed over or backspaced — and shown with a muted grey background/letter so they read as "given," not "yours"
- Clicking a revealed cell still selects it (so its clue is visible); typing on it just advances the cursor
- "Clear" restores revealed letters instead of wiping them
- Distribution is pure random across the whole grid (not guaranteed per-word), so by chance some words may get zero free letters and others may get several
- Goal: give first-time users (unfamiliar with AI vocabulary) a toehold without a "cheat sheet" they could just read off, unlike flashing the word list beforehand — but only when they ask for it, not forced on every puzzle

---

### Admin Controls

Stored in `src/data/adminConfig.js`. Controls which modes are available app-wide.

```js
export const adminConfig = {
  allowCheckAnswers: true,       // Mode 1
  allowLiveFeedback: true,       // Mode 2
  allowRevealLetter: true,       // Mode 3a
  allowRevealWord: true,         // Mode 3b
  defaultMode: 'checkAnswers',   // Which mode is pre-selected on load
};
```

- If a mode is disabled, it is hidden from the user's mode selector
- Allows the app to be configured for different audiences (e.g. classroom = no reveal, casual = all modes on)
- Admin config is a code-level change for now — no UI admin panel yet

---

### Colour Legend

Shown below the grid at all times. Explains the colour coding to the user.
- Green swatch = Correct
- Red swatch = Wrong
- White swatch = Not checked yet
- Legend description text changes based on which mode is active

---

### Word Bank

Stored in `src/data/wordBank.json`. Single source of truth for all words and clues.

- 179 terms total: 62 beginner, 64 intermediate, 53 advanced (grown from the original 45 on 2026-07-12)
- Each entry has: word, clue, category (general / ml / llm), subject (LLM, Prompt Engineering, Machine Learning, NLP, AI Ethics & Safety, AI Agents)
- Sources: bfortuner/ml-glossary (MIT licence) + holasoymalva/llm-glossary (open source)
- Multi-word terms (e.g. MACHINE LEARNING) are stored without the space (see Multi-word terms decision below); 2-word compounds only — the grid's break marker only supports a single break point, so 3+ word phrases stay reserved in `_multiword_future` until the generator supports more than one break
- `src/data/puzzleData.js` passes the **full** word list per difficulty into the generator (not a fixed hand-picked subset) — `generateCrossword()` places whatever fits well (~9-13 words per puzzle), so which words appear varies puzzle to puzzle

---

### Mobile Responsive Layout

- **Grid sizing:** cell size is a single CSS custom property (`--cell-size`) read by both the grid's `grid-template-columns` and each `.cell`'s width/height, set per breakpoint by media queries. On mobile (≤720px) it switches to fluid `1fr` columns with `aspect-ratio: 1` cells instead of a fixed size, so the grid always fills the white puzzle card's width exactly, with no leftover white space and no overflow
- **Layout order:** `.puzzle-layout` is a CSS grid using `grid-template-areas` with three named areas — grid, clues, actions (`CrosswordActions.js`, split out of `CrosswordGrid.js` so it's its own grid item). Desktop: grid+actions stacked on the left, clues on the right (unchanged from before). Mobile: grid, then clues, then actions — reordered purely via CSS, markup order unchanged
- **Level selector:** Beginner/Intermediate/Advanced buttons shrink (smaller padding/font, tighter gaps) below 420px so all three fit on one row instead of the third wrapping to its own line
- A `.grid-scroll` wrapper adds `overflow-x: auto` as a last-resort fallback so an unexpectedly narrow viewport scrolls instead of clipping

---

### Local Profile & Stats (Login page)

No real accounts — see the Local-only decision below. `src/utils/progress.js` owns all of this via `localStorage`.

- **Name required, no password** — Login won't let you Continue without typing a name. First-time visitors see a plain name field; returning visitors (name already saved) see a greeting + stats card instead, with a "Not you?" link to switch names (this does not wipe stats — stats belong to the device, not the name)
- **Fresh words:** puzzles filter out words already shown at that difficulty (marked "seen" at puzzle-generation time, not completion time, so abandoning a puzzle still avoids repeats). Once a difficulty's puzzle generation places too few words from the unseen pool (fewer than 6), it recycles — clears that difficulty's seen-words and regenerates from the full list
- **Stats tracked:** overall attempted/correct + a per-subject accuracy breakdown (best-accuracy-first, subjects with zero attempts omitted), recorded once per puzzle the moment it's fully solved
- **"Correct" definition:** a word only counts as correct if none of its cells were ever touched by Reveal Letter, Reveal Word, or Need Help — otherwise it's attempted but not correct
- **Local-only, single device:** everything lives in this browser's `localStorage`. Playing on a different phone or browser starts a completely separate profile with no shared history — there is no backend yet (see Backlog)

---

## Decision Log

Chronological record of decisions made and why.

---

**2026-06-27 — Project kickoff**
- Chose web-first over Android. Reason: faster to build and test, no app store friction.
- Chose React + Vercel. Reason: Sri's environment already had Node; Vercel is free and deploys automatically on git push.
- Chose plain CSS over Tailwind. Reason: Tailwind not yet installed; keep it simple for now.

**2026-06-28 — First crossword built**
- 10 beginner words chosen manually for Sprint 1 puzzle. Reason: hand-placed grid gives full control over intersections; algorithmic grid generation is too complex for this stage.
- 3-mode hint system designed. Reason: different users have different learning styles — some want to be challenged, some want help. Admin config lets us tune per audience.
- Decided clues should explain concepts, not just name them. Reason: the learning happens in the clue, not just the answer.

**2026-06-28 — Word bank architecture**
- Created wordBank.json as the single source of truth. Reason: avoids hardcoding words in multiple places; easier to add/edit terms later.
- Split into beginner / intermediate / advanced arrays. Reason: supports the planned difficulty selector without restructuring the file.
- Reserved multi-word terms separately. Reason: they need a special grid feature (word-break marker) before they can be used.

**2026-06-29 — Multi-word terms design decision**
- Multi-word terms will be stored without the space in the grid (e.g. MACHINELEARNING as one continuous run of cells).
- A visual break marker will appear between the two words (British crossword style).
- The clue will indicate "(2 words)" so the user knows to expect two words.
- First two terms to implement: MACHINE LEARNING + DEEP LEARNING (most familiar to beginners).

**2026-07-07 — Pre-filled starting letters**
- Testers unfamiliar with AI terms got stuck with zero footholds under "Check Answers" mode and gave up. Reason: crossword hint modes assume you already know the word and need to recall it — new vocabulary has nothing to recall.
- Considered flashing the word list before play, rejected: users could just keep re-reading it as a cheat sheet instead of trying to recall.
- Chose Sudoku-style random pre-filled letters (12% of grid, locked) instead — gives a foothold while still requiring active recall for the rest.
- Chose pure random distribution over "1 guaranteed letter per word" for v1 — simpler, can revisit if some words end up with zero hints too often in practice.

**2026-07-07 — Made pre-fill opt-in ("Need Help" button)**
- After testing the auto pre-filled grid, decided letters showing up automatically felt like it undercut the puzzle before the user even started.
- Changed to opt-in: grid loads empty, user clicks "Need Help" (caption: "Reveal some random letters") to get the same 12% random locked reveal, once per puzzle.
- Kept everything else about the mechanic (locked cells, muted styling, Clear restores them) — only the trigger moved from automatic to user-initiated.

**2026-07-07 — Sprint 4: added routing (Login → Landing → Puzzle)**
- App had no routing — App.js rendered the Crossword directly. Added react-router-dom with 3 routes so future pages (Admin section, Practice by Topic) have somewhere to live.
- Started with the navigation restructure ahead of the Login page and Admin section items, since both depend on routing existing first.
- Login page is a stub: no real auth, just a Continue button to `/home`. Landing page (`/home`) is the hub with a single "Crossword Puzzle" link for now.
- Tried react-router-dom v7 first — its package.json `exports` map isn't resolvable by CRA5's Jest resolver (`Cannot find module 'react-router/dom'`), and CRA doesn't expose a way to override Jest's module resolution without ejecting. Downgraded to v6, which works with this toolchain out of the box and covers everything needed (routes, Link, useNavigate).
- Updated the stale default CRA test (`App.test.js` was still checking for a "learn react" link) to check that the Login page renders instead.

**2026-07-12 — Mobile grid overflow root cause + fix**
- Grid overflowed on phones despite an existing mobile media query. Root cause: `CrosswordGrid.js` set `grid-template-columns` via an inline JS style (`repeat(GRID_COLS, 36px)`) — inline styles can't be overridden by a CSS media query, so the grid stayed desktop-width regardless of screen size while individual `.cell` boxes shrank, leaving them mismatched.
- Fixed by moving cell sizing entirely into CSS via a `--cell-size` custom property, set inline only for the column *count* (legitimately dynamic data) and never for size.
- Later found the fixed-size mobile cells (26px) still didn't reliably fill the actual card width across different phone widths — switched mobile to fluid `1fr` columns + `aspect-ratio: 1` squares so the grid always exactly fills the card, no matter the device.

**2026-07-12 — Mobile layout reorder (grid → clues → actions)**
- Sri asked for clues directly below the grid and action buttons below the clues on mobile, plus the level-selector buttons fitting on one row.
- Action buttons lived inside `CrosswordGrid.js` alongside the grid, so they couldn't be independently repositioned relative to the (separate) clues component via flexbox. Split them into `CrosswordActions.js` and switched `.puzzle-layout` from flexbox to CSS Grid with `grid-template-areas`, so each of grid/clues/actions can be placed per breakpoint without touching render order or duplicating markup.

**2026-07-12 — Grew word bank to 179 terms, puzzles draw from the full pool**
- Added 100 new AI/ML/LLM terms (bringing 79 → 179) so Sri could share the app with friends and have them see more variety than the original fixed 29-word puzzle picks.
- Initially just added the words to `wordBank.json` without wiring them up — realized (and Sri confirmed) that `puzzleData.js` only pulled a fixed, named 29-word subset, so the extra words wouldn't actually appear in any puzzle. Changed `puzzleData.js` to pass the *full* per-difficulty list into `generateCrossword()` instead.
- Verified via a standalone Node simulation (mocked nothing but timing) that this doesn't hurt performance or puzzle quality: ~300-450ms generation time, 9-13 words placed per puzzle, consistent across repeated runs.

**2026-07-12 — Login page: local profile + stats, not real accounts**
- Sri wanted the Login page to (1) serve fresh, non-repeating words and (2) show personal metrics, including per-subject accuracy (using the `subject` tags already on wordBank.json entries).
- Considered real accounts (backend + database, works across devices) vs. a local-only profile (name only, no password, `localStorage`, one device). Chose local-only: this app has no backend at all yet, and local storage covers both stated goals without new infrastructure. Explicit tradeoff accepted: stats don't follow a user across devices (see Backlog — Cross-device backend).
- Defined "correct" as solved-unaided (no Reveal Letter/Word/Need Help used on that word) per Sri's call, so revealed words still count as attempted but don't inflate accuracy.
- Bug found during verification: an initial "recycle when the *remaining unseen pool* drops below N words" rule still produced a near-empty puzzle (1 word placed) when the leftover words just didn't intersect well — fixed by checking the actual `placed.length` after generation instead of the input pool size.
- Initially patched a "blank name but has stats" edge case by decoupling the stats card from the name-editing state. Sri asked for the simpler fix instead: just require a name to Continue at all, removing the edge case entirely rather than working around it.

**2026-07-12 — Cross-device backend: deferred, no decision yet**
- Sri asked about using a JSON file as a lightweight backend for cross-device stats, wanting to stay on the free tier while still deciding what he actually wants.
- Clarified that Vercel serverless functions have an ephemeral filesystem — a JSON file written from a function doesn't persist between invocations, so this isn't viable as-is.
- Two free-tier-compatible options surfaced for whenever this gets prioritized: (a) a serverless function reading/writing a JSON file in a GitHub repo via the GitHub API (genuinely free, but fragile — multi-second commit latency, no concurrency protection); (b) a proper free-tier database (Supabase, Firebase) — purpose-built for this, still free at this app's scale. No decision made; not being built until Sri picks a direction.

**2026-06-29 — Token efficiency & file strategy**
- Agreed to keep CLAUDE.md lean (working guide, ~90 lines) and PRODUCT.md as the permanent record.
- Pruning rule: when a sprint is complete, move its detailed spec here and remove from CLAUDE.md.
- Planned code split: break Crossword.js (~400 lines) into focused files (~80 lines each) to reduce tokens read per session.

---

## Backlog & Future Ideas

Items discussed but not scheduled. Review at sprint planning.

| Item | Notes | Priority |
|------|-------|----------|
| Cross-device backend | Local profile/stats (shipped 2026-07-12) only track one device/browser. Options explored: GitHub-API JSON-file hack (free, fragile) vs. proper free-tier DB (Supabase/Firebase). Undecided — Sri still thinking through what he wants, staying free-tier for now | Later |
| Reveal limits | Cap letters/words revealed per word and per session | Later |
| Topic selector | Let user pick a topic (LLMs, Prompts, Custom Chats) not just difficulty | Later |
| Real accounts | Login/password across devices — local-only profile shipped 2026-07-12 as an interim step; see Cross-device backend above | Future sprint |
| More puzzle types | Beyond crosswords — future formats TBD | Future |
| Mobile app | After web app is validated | Future |
| Admin UI panel | Currently admin config is code-only | Future |
| Metrics | Local per-device attempted/correct + per-subject accuracy shipped 2026-07-12 (see Local Profile & Stats). Server-side/aggregate analytics across all users still future | Later |
