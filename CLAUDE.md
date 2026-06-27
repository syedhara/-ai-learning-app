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
| Styling | Tailwind CSS |
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

- [ ] Push project to GitHub
- [ ] Connect to Vercel and deploy
- [ ] Build first working crossword (10–15 AI terms, Beginner level)
- [ ] Add difficulty level selector

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

## Session Notes

Use this section to track decisions made across sessions:

- **2026-06-27:** Project started. Chose web-first approach over Android. React + Vercel stack decided. Environment fully set up on Mac.
