// Word list and clues for the Beginner AI Concepts crossword puzzle
// Grid is 13 rows x 14 columns (0-indexed)

export const GRID_ROWS = 13;
export const GRID_COLS = 14;

// Each word has a number, the word itself, direction, starting row/col, and the clue
export const words = [
  { number: 1,  word: 'CHATBOT',       direction: 'across', row: 0, col: 0,  clue: 'An AI system designed to have text conversations' },
  { number: 2,  word: 'HALLUCINATION', direction: 'down',   row: 0, col: 1,  clue: 'When an AI confidently states something false' },
  { number: 3,  word: 'TRAINING',      direction: 'down',   row: 0, col: 3,  clue: 'The process of teaching an AI using data' },
  { number: 4,  word: 'TOKEN',         direction: 'down',   row: 0, col: 6,  clue: 'The unit AI models use to measure text length' },
  { number: 5,  word: 'PROMPT',        direction: 'across', row: 1, col: 4,  clue: 'The instruction you give an AI to get a response' },
  { number: 6,  word: 'MODEL',         direction: 'down',   row: 1, col: 7,  clue: 'The trained AI system that generates responses' },
  { number: 7,  word: 'FINETUNE',      direction: 'down',   row: 3, col: 4,  clue: 'To further train an existing model on specific data' },
  { number: 8,  word: 'DATASET',       direction: 'across', row: 3, col: 7,  clue: 'A collection of data used to train an AI' },
  { number: 9,  word: 'OUTPUT',        direction: 'down',   row: 5, col: 5,  clue: 'What the AI produces in response to your input' },
  { number: 10, word: 'NEURAL',        direction: 'across', row: 6, col: 3,  clue: 'Type of ___ network inspired by the human brain' },
];
