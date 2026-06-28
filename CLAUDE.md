# CLAUDE.md — AI Learning App

This file gives Claude context about this project so every conversation starts informed.

---

## Project Overview

**Name:** AI Learning App
**Goal:** Help people learn AI concepts through interactive crossword puzzles
**Owner:** Sri (Senior Manager, Hyderabad)
**Status:** Active development — Sprint 1

---

## What We're Building

A web app where users can:
- Choose their level: Beginner / Intermediate / Advanced
- Solve AI-themed crossword puzzles
- Learn AI concepts through the clues themselves (clues explain concepts, not just name them)

Future features (later sprints):
- User accounts and progress tracking
- More puzzle types beyond crosswords
- Mobile app (after web app is validated)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (JavaScript) |
| Styling | Plain CSS (Tailwind deferred — not yet installed) |
| Backend | None (for now) |
| Database | None (for now — puzzle data in app) |
| Hosting | Vercel (free tier) |
| Version Control | GitHub |

---

## Project Structure

```
ai-learning-app/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── data/            # Puzzle word/clue data
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
├── CLAUDE.md            # This file
└── package.json
```

---

## Developer Context

- **Owner background:** Senior Manager (4 scrum teams), not a developer — last coded 15 years ago
- **Working style:** Iterative, continuous improvement, scope will evolve
- **Claude's role:** Write the code, explain decisions, guide setup steps
- **Owner's role:** Product Owner — decides what to build, tests, gives feedback

---

## Coding Guidelines

When writing code for this project:
- **Keep it simple** — no over-engineering, owner is learning as we go
- **Comment the code** — explain what each section does in plain English
- **One thing at a time** — small, testable changes per session
- **Mobile-friendly** — responsive design from the start (Tailwind helps here)
- **Beginner-safe** — avoid advanced patterns until the basics are solid

---

## Current Sprint — Sprint 1

- [x] Push project to GitHub
- [x] Connect to Vercel and deploy — https://github.com/syedhara/-ai-learning-app
- [x] Build first working crossword (10 AI terms, Beginner level)
- [ ] Add difficulty level selector
- [ ] Build hint/check system (see Requirements below)

---

## Word Bank — Beginner AI Terms

Starter list for first puzzle (clue ideas in brackets):

| Word | Clue |
|------|------|
| PROMPT | The instruction you give an AI to get a response |
| TOKEN | The unit AI models use to measure text length |
| MODEL | The trained AI system that generates responses |
| NEURAL | Type of network inspired by the human brain |
| TRAINING | The process of teaching an AI using data |
| DATASET | A collection of data used to train an AI |
| OUTPUT | What the AI produces in response to your input |
| CHATBOT | An AI designed to have text conversations |
| HALLUCINATION | When an AI confidently states something false |
| FINETUNE | To further train a model on specific data |

---

## Useful Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Install a new package
npm install package-name

# Check git status
git status

# Save and push to GitHub
git add .
git commit -m "describe what you changed"
git push
```

---

## Requirements

### Crossword Puzzle — Hint & Check System

Users can choose how much help they want while solving the puzzle. Three modes are available, and the user selects their preferred mode before or during play.

---

#### Mode 1 — Check Answers (Final Check)
- User fills in the entire puzzle, then clicks "Check Answers"
- Correct cells turn **green**, wrong cells turn **red**
- Empty cells are ignored (no penalty)
- If everything is correct, a congratulations banner appears
- Typing again clears the color feedback
- **Good for:** Confident learners who want no hints during play

#### Mode 2 — Check as You Type (Live Feedback)
- As soon as the user types a letter, the cell immediately turns green or red
- No button needed — feedback is instant
- **Good for:** Learners who want real-time reinforcement

#### Mode 3 — Reveal on Demand (Generous Mode)
Two sub-options available to the user:
- **Reveal Letter** — fills in just the selected cell with the correct answer
- **Reveal Word** — fills in all cells of the currently selected word

The user can use these at any time, no restrictions.

**Good for:** Beginners who get stuck and want to learn by seeing the answer

---

#### User Choice
- A **mode selector** (e.g. toggle or dropdown) is shown to the user at the top of the puzzle
- Default mode: **Check Answers** (least revealing)
- User can switch modes at any time during play
- Selection persists within the session (not saved across visits yet)

---

#### Admin Controls
An admin-level configuration (stored in `src/data/adminConfig.js`) controls which modes are available:

```js
// Example admin config
export const adminConfig = {
  allowCheckAnswers: true,       // Mode 1
  allowCheckAsYouType: true,     // Mode 2
  allowRevealLetter: true,       // Mode 3a
  allowRevealWord: true,         // Mode 3b
  defaultMode: 'checkAnswers',   // Which mode is pre-selected
};
```

- If a mode is disabled by admin, it is hidden from the user's mode selector
- This allows the app to be configured for different audiences (e.g. classroom = no reveal, casual = all modes on)
- Admin config is a code-level change for now (no UI admin panel yet)

---

### Crossword Puzzle — Grid & Gameplay

- 10 AI terms per puzzle (Beginner level)
- Words intersect at shared letters (standard crossword rules)
- Click a cell to select it; click again to toggle Across ↔ Down
- Type to fill letters; cursor auto-advances
- Backspace clears and moves back
- Arrow keys navigate
- Clicking a clue in the panel jumps to that word's first cell
- Active word is highlighted in blue; selected cell is darker blue

---

## Session Notes

Use this section to track decisions made across sessions:

- **2026-06-27:** Project started. Chose web-first approach over Android. React + Vercel stack decided. Environment fully set up on Mac.
- **2026-06-28:** GitHub pushed. Vercel deployed. First crossword built (10 words, Beginner). Hint/check system requirements defined — 3 modes with admin config toggle.
