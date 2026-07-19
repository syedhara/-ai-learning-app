import wordBank from './wordBank.json';

// Grid dimensions — must match the generator in src/utils/generateCrossword.js
export const GRID_ROWS = 13;
export const GRID_COLS = 14;

// Word lists per difficulty — the full wordBank.json entry list for that level.
// generateCrossword() only places as many as fit well in one 13x14 grid (via
// random anchor + shuffle attempts), so each generated puzzle surfaces a
// different subset — the pool it draws from is just much bigger now.
export const wordListsByDifficulty = {
  beginner: wordBank.beginner,
  intermediate: wordBank.intermediate,
  advanced: wordBank.advanced,
};

// Every word across all three difficulties, each tagged with its difficulty —
// used by the Review Vocabulary / Flashcards pages, which browse the whole
// word bank rather than just one generated puzzle's worth.
export const allWords = Object.entries(wordListsByDifficulty).flatMap(
  ([difficulty, list]) => list.map(entry => ({ ...entry, difficulty }))
);

// Every distinct subject tag, alphabetical — populates the subject filter.
export const subjects = [...new Set(allWords.map(w => w.subject))].sort();

