import wordBank from './wordBank.json';

// Grid dimensions
export const GRID_ROWS = 13;
export const GRID_COLS = 14;

// Pull a word's text and clue from the word bank so we don't hardcode them here
const beginner = wordBank.beginner;
const lookup = (w) => beginner.find(entry => entry.word === w) || { word: w, clue: '' };

// Puzzle layout — defines where each word sits on the grid (row, col, direction).
// Word text and clues come from wordBank.json above.
export const words = [
  { number: 1,  direction: 'across', row: 0, col: 0,  ...lookup('CHATBOT')       },
  { number: 2,  direction: 'down',   row: 0, col: 1,  ...lookup('HALLUCINATION') },
  { number: 3,  direction: 'down',   row: 0, col: 3,  ...lookup('TRAINING')      },
  { number: 4,  direction: 'down',   row: 0, col: 6,  ...lookup('TOKEN')         },
  { number: 5,  direction: 'across', row: 1, col: 4,  ...lookup('PROMPT')        },
  { number: 6,  direction: 'down',   row: 1, col: 7,  ...lookup('MODEL')         },
  { number: 7,  direction: 'down',   row: 3, col: 4,  ...lookup('FINETUNE')      },
  { number: 8,  direction: 'across', row: 3, col: 7,  ...lookup('DATASET')       },
  { number: 9,  direction: 'down',   row: 5, col: 5,  ...lookup('OUTPUT')        },
  { number: 10, direction: 'across', row: 6, col: 3,  ...lookup('NEURAL')        },
];
