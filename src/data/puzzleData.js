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
