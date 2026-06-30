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

- 45 terms total: 18 beginner, 17 intermediate, 10 advanced
- Each entry has: word, clue, category (general / ml / llm)
- Sources: bfortuner/ml-glossary (MIT licence) + holasoymalva/llm-glossary (open source)
- Multi-word terms (e.g. MACHINE LEARNING) are reserved in `_multiword_reserved` — not yet in puzzles

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

**2026-06-29 — Token efficiency & file strategy**
- Agreed to keep CLAUDE.md lean (working guide, ~90 lines) and PRODUCT.md as the permanent record.
- Pruning rule: when a sprint is complete, move its detailed spec here and remove from CLAUDE.md.
- Planned code split: break Crossword.js (~400 lines) into focused files (~80 lines each) to reduce tokens read per session.

---

## Backlog & Future Ideas

Items discussed but not scheduled. Review at sprint planning.

| Item | Notes | Priority |
|------|-------|----------|
| Mobile fix | UI breaks on Samsung Galaxy S26 Ultra; keyboard doesn't pop up on cell tap | Later |
| Reveal limits | Cap letters/words revealed per word and per session | Later |
| Topic selector | Let user pick a topic (LLMs, Prompts, Custom Chats) not just difficulty | Later |
| User accounts | Login, progress tracking across sessions | Future sprint |
| More puzzle types | Beyond crosswords — future formats TBD | Future |
| Mobile app | After web app is validated | Future |
| Admin UI panel | Currently admin config is code-only | Future |
