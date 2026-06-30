/**
 * Crossword Grid Generator
 * Run with: node scripts/generate-crossword.js
 *
 * Tries hundreds of word orderings and picks the layout that places the most words.
 */

const GRID_ROWS = 13;
const GRID_COLS = 14;

function canPlace(grid, word, direction, row, col) {
  const len = word.length;

  if (direction === 'across') {
    if (row < 0 || row >= GRID_ROWS || col < 0 || col + len > GRID_COLS) return false;
  } else {
    if (col < 0 || col >= GRID_COLS || row < 0 || row + len > GRID_ROWS) return false;
  }

  // Nothing immediately before or after the word (would merge two words)
  if (direction === 'across') {
    if (col > 0 && grid[row][col - 1] !== null) return false;
    if (col + len < GRID_COLS && grid[row][col + len] !== null) return false;
  } else {
    if (row > 0 && grid[row - 1][col] !== null) return false;
    if (row + len < GRID_ROWS && grid[row + len][col] !== null) return false;
  }

  for (let i = 0; i < len; i++) {
    const r = direction === 'down' ? row + i : row;
    const c = direction === 'across' ? col + i : col;

    if (grid[r][c] !== null) {
      if (grid[r][c] !== word[i]) return false; // Letter mismatch at intersection
    } else {
      // Empty cell — must not be parallel-adjacent to another word
      if (direction === 'across') {
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r < GRID_ROWS - 1 && grid[r + 1][c] !== null) return false;
      } else {
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c < GRID_COLS - 1 && grid[r][c + 1] !== null) return false;
      }
    }
  }

  return true;
}

function applyWord(grid, word, direction, row, col) {
  const g = grid.map(r => [...r]);
  for (let i = 0; i < word.length; i++) {
    const r = direction === 'down' ? row + i : row;
    const c = direction === 'across' ? col + i : col;
    g[r][c] = word[i];
  }
  return g;
}

function tryLayout(wordList) {
  let grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  const placed = [];

  // Place the first word horizontally in the centre
  const first = wordList[0];
  const r0 = Math.floor(GRID_ROWS / 2);
  const c0 = Math.floor((GRID_COLS - first.length) / 2);
  grid = applyWord(grid, first, 'across', r0, c0);
  placed.push({ word: first, direction: 'across', row: r0, col: c0 });

  const toPlace = wordList.slice(1);
  let changed = true;

  while (changed && toPlace.length > 0) {
    changed = false;
    for (let wi = toPlace.length - 1; wi >= 0; wi--) {
      const word = toPlace[wi];
      outerLoop:
      for (const pw of placed) {
        const opp = pw.direction === 'across' ? 'down' : 'across';
        for (let pi = 0; pi < pw.word.length; pi++) {
          for (let wi2 = 0; wi2 < word.length; wi2++) {
            if (pw.word[pi] !== word[wi2]) continue;
            const rr = opp === 'down'   ? pw.row - wi2  : pw.row + pi;
            const cc = opp === 'across' ? pw.col - wi2  : pw.col;

            if (canPlace(grid, word, opp, rr, cc)) {
              grid = applyWord(grid, word, opp, rr, cc);
              placed.push({ word, direction: opp, row: rr, col: cc });
              toPlace.splice(wi, 1);
              changed = true;
              break outerLoop;
            }
          }
        }
      }
    }
  }

  return { placed, unplaced: toPlace, grid };
}

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Try many orderings (both anchor directions); return layout with most words placed
function bestLayout(wordList, attempts = 2000) {
  let best = null;

  function tryAll(ordered, anchorDir) {
    // Override anchor placement direction
    const first = ordered[0];
    const r0 = anchorDir === 'across'
      ? Math.floor(GRID_ROWS / 2)
      : Math.floor((GRID_ROWS - first.length) / 2);
    const c0 = anchorDir === 'across'
      ? Math.floor((GRID_COLS - first.length) / 2)
      : Math.floor(GRID_COLS / 2);

    if (r0 < 0 || c0 < 0 || r0 + (anchorDir === 'down' ? first.length : 1) > GRID_ROWS) return;

    let grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
    const placed = [];
    grid = applyWord(grid, first, anchorDir, r0, c0);
    placed.push({ word: first, direction: anchorDir, row: r0, col: c0 });

    const toPlace = ordered.slice(1);
    let changed = true;
    while (changed && toPlace.length > 0) {
      changed = false;
      for (let wi = toPlace.length - 1; wi >= 0; wi--) {
        const word = toPlace[wi];
        outerLoop:
        for (const pw of placed) {
          const opp = pw.direction === 'across' ? 'down' : 'across';
          for (let pi = 0; pi < pw.word.length; pi++) {
            for (let wi2 = 0; wi2 < word.length; wi2++) {
              if (pw.word[pi] !== word[wi2]) continue;
              const rr = opp === 'down'   ? pw.row - wi2 : pw.row + pi;
              const cc = opp === 'across' ? pw.col - wi2 : pw.col;
              if (canPlace(grid, word, opp, rr, cc)) {
                grid = applyWord(grid, word, opp, rr, cc);
                placed.push({ word, direction: opp, row: rr, col: cc });
                toPlace.splice(wi, 1);
                changed = true;
                break outerLoop;
              }
            }
          }
        }
      }
    }

    const result = { placed, unplaced: toPlace, grid };
    if (!best || result.placed.length > best.placed.length) best = result;
  }

  const perAnchor = Math.ceil(attempts / wordList.length);
  for (const anchor of wordList) {
    const rest = wordList.filter(w => w !== anchor);
    for (let i = 0; i < perAnchor; i++) {
      const ordered = [anchor, ...shuffle(rest)];
      tryAll(ordered, 'across');
      tryAll(ordered, 'down');
      if (best && best.placed.length === wordList.length) return best;
    }
  }
  return best;
}

function printGrid(grid) {
  for (let r = 0; r < GRID_ROWS; r++) {
    console.log(grid[r].map(c => c || '.').join(' '));
  }
}

function printPuzzleData(placed, level, bankKey) {
  console.log(`\n// Paste into puzzleData.js:`);
  console.log(`const ${level}Lookup = (w) => wordBank.${bankKey}.find(e => e.word === w) || { word: w, clue: '' };`);
  console.log(`export const ${level}Words = [`);
  placed.forEach((p, i) => {
    console.log(`  { number: ${i + 1}, direction: '${p.direction}', row: ${p.row}, col: ${p.col}, ...${level}Lookup('${p.word}') },`);
  });
  console.log(`];`);
}

// ── INTERMEDIATE ──────────────────────────────────────────────────────────────
// Mix of long, medium, short words for best intersection variety
const intWords = [
  'TRANSFORMER', 'REGRESSION', 'SUPERVISED',
  'PARAMETER',   'PRECISION',  'FEATURE',
  'RECALL',      'EPOCH',      'LOSS',
];

console.log('\n════════════════════════════════════════');
console.log('  INTERMEDIATE  (trying 500 orderings)');
console.log('════════════════════════════════════════');

const intResult = bestLayout(intWords, 500);

console.log(`\nPlaced ${intResult.placed.length} / ${intWords.length} words:`);
intResult.placed.forEach((p, i) =>
  console.log(`  ${i+1}. ${p.word.padEnd(14)} ${p.direction.padEnd(7)} row ${p.row}, col ${p.col}`)
);
if (intResult.unplaced.length) console.log('\nUnplaced:', intResult.unplaced);

console.log('\nGrid:');
printGrid(intResult.grid);
printPuzzleData(intResult.placed, 'intermediate', 'intermediate');

// ── ADVANCED ─────────────────────────────────────────────────────────────────
// Mix: not all 14-letter giants — include shorter ones for variety
// HYPERPARAMETER (14 letters) conflicts with REGULARIZATION (also 14) — both can't fit.
// Using all other 9 advanced words instead.
const advWords = [
  'NORMALIZATION', 'REINFORCEMENT', 'CONVERGENCE',
  'PRETRAINING',   'QUANTIZATION',  'REGULARIZATION',
  'PERPLEXITY',    'ATTENTION',     'VARIANCE',
];

console.log('\n════════════════════════════════════════');
console.log('  ADVANCED  (trying 500 orderings)');
console.log('════════════════════════════════════════');

const advResult = bestLayout(advWords, 500);

console.log(`\nPlaced ${advResult.placed.length} / ${advWords.length} words:`);
advResult.placed.forEach((p, i) =>
  console.log(`  ${i+1}. ${p.word.padEnd(16)} ${p.direction.padEnd(7)} row ${p.row}, col ${p.col}`)
);
if (advResult.unplaced.length) console.log('\nUnplaced:', advResult.unplaced);

console.log('\nGrid:');
printGrid(advResult.grid);
printPuzzleData(advResult.placed, 'advanced', 'advanced');
