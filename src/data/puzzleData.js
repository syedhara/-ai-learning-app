import wordBank from './wordBank.json';

// Grid dimensions — must match the generator in src/utils/generateCrossword.js
export const GRID_ROWS = 13;
export const GRID_COLS = 14;

// Helper: pull specific words from a difficulty level in wordBank.json
const pick = (level, wordNames) =>
  wordNames.map(w => wordBank[level].find(e => e.word === w)).filter(Boolean);

// Word lists per difficulty — these are passed to generateCrossword() at runtime.
// To add a word to a puzzle: add it to wordBank.json first, then include its key here.
export const wordListsByDifficulty = {
  beginner: pick('beginner', [
    'CHATBOT', 'HALLUCINATION', 'TRAINING', 'TOKEN', 'PROMPT',
    'MODEL', 'FINETUNE', 'DATASET', 'OUTPUT', 'NEURAL',
    'DEEPLEARNING', 'CONTEXTWINDOW',
  ]),
  intermediate: pick('intermediate', [
    'TRANSFORMER', 'REGRESSION', 'SUPERVISED', 'PARAMETER', 'PRECISION',
    'FEATURE', 'RECALL', 'EPOCH', 'LOSS',
  ]),
  advanced: pick('advanced', [
    'NORMALIZATION', 'CONVERGENCE', 'REGULARIZATION', 'QUANTIZATION',
    'ATTENTION', 'PERPLEXITY', 'VARIANCE', 'PRETRAINING',
  ]),
};
