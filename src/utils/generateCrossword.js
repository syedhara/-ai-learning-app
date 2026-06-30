/**
 * generateCrossword.js
 * Runs in the browser at runtime — takes a list of word entries from wordBank.json
 * and finds a valid crossword grid layout where words intersect at shared letters.
 */

const GRID_ROWS = 13;
const GRID_COLS = 14;

// Can we place this word on the grid without conflicts?
function canPlace(grid, word, direction, row, col) {
  const len = word.length;

  if (direction === 'across') {
    if (row < 0 || row >= GRID_ROWS || col < 0 || col + len > GRID_COLS) return false;
  } else {
    if (col < 0 || col >= GRID_COLS || row < 0 || row + len > GRID_ROWS) return false;
  }

  // Nothing immediately before or after the word (would merge two words)
  if (direction === 'across') {
    if (col > 0 && grid[row][col - 1]) return false;
    if (col + len < GRID_COLS && grid[row][col + len]) return false;
  } else {
    if (row > 0 && grid[row - 1][col]) return false;
    if (row + len < GRID_ROWS && grid[row + len][col]) return false;
  }

  for (let i = 0; i < len; i++) {
    const r = direction === 'down' ? row + i : row;
    const c = direction === 'across' ? col + i : col;

    if (grid[r][c]) {
      if (grid[r][c] !== word[i]) return false; // letter mismatch
    } else {
      // Empty cell — not allowed to be parallel-adjacent to another word
      if (direction === 'across') {
        if (r > 0 && grid[r - 1][c]) return false;
        if (r < GRID_ROWS - 1 && grid[r + 1][c]) return false;
      } else {
        if (c > 0 && grid[r][c - 1]) return false;
        if (c < GRID_COLS - 1 && grid[r][c + 1]) return false;
      }
    }
  }
  return true;
}

// Write a word into the grid (returns new grid, no mutation)
function applyWord(grid, word, direction, row, col) {
  const g = grid.map(r => [...r]);
  for (let i = 0; i < word.length; i++) {
    const r = direction === 'down' ? row + i : row;
    const c = direction === 'across' ? col + i : col;
    g[r][c] = word[i];
  }
  return g;
}

// Standard crossword numbering: top-to-bottom, left-to-right
// Words sharing a starting cell share the same number
function numberWords(placed) {
  const posNums = {};
  let next = 1;
  const sorted = [...placed].sort((a, b) =>
    a.row !== b.row ? a.row - b.row : a.col - b.col
  );
  for (const e of sorted) {
    const key = `${e.row}-${e.col}`;
    if (!posNums[key]) posNums[key] = next++;
  }
  return placed.map(e => ({ ...e, number: posNums[`${e.row}-${e.col}`] }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// One placement attempt with a given word order and anchor direction
function tryLayout(entries, anchorDir = 'across') {
  const first = entries[0];
  const w = first.word;
  const r0 = anchorDir === 'across'
    ? Math.floor(GRID_ROWS / 2)
    : Math.floor((GRID_ROWS - w.length) / 2);
  const c0 = anchorDir === 'across'
    ? Math.floor((GRID_COLS - w.length) / 2)
    : Math.floor(GRID_COLS / 2);

  if (r0 < 0 || c0 < 0) return { placed: [], unplaced: [...entries] };

  let grid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));
  const placed = [{ ...first, direction: anchorDir, row: r0, col: c0 }];
  grid = applyWord(grid, w, anchorDir, r0, c0);

  const toPlace = entries.slice(1);
  let changed = true;

  while (changed && toPlace.length > 0) {
    changed = false;
    for (let wi = toPlace.length - 1; wi >= 0; wi--) {
      const entry = toPlace[wi];
      outerLoop:
      for (const pw of placed) {
        const opp = pw.direction === 'across' ? 'down' : 'across';
        for (let pi = 0; pi < pw.word.length; pi++) {
          for (let wi2 = 0; wi2 < entry.word.length; wi2++) {
            if (pw.word[pi] !== entry.word[wi2]) continue;
            const rr = opp === 'down'   ? pw.row - wi2 : pw.row + pi;
            const cc = opp === 'across' ? pw.col - wi2 : pw.col;
            if (canPlace(grid, entry.word, opp, rr, cc)) {
              grid = applyWord(grid, entry.word, opp, rr, cc);
              placed.push({ ...entry, direction: opp, row: rr, col: cc });
              toPlace.splice(wi, 1);
              changed = true;
              break outerLoop;
            }
          }
        }
      }
    }
  }

  return { placed: numberWords(placed), unplaced: toPlace };
}

/**
 * Main export.
 * Takes an array of word bank entries ({ word, clue, breakAfter?, ... })
 * and returns { placed, unplaced } where placed entries have row, col, direction, number added.
 *
 * Runs up to `attempts` random orderings and returns the layout that placed the most words.
 */
export function generateCrossword(entries, attempts = 500) {
  let best = null;
  const perAnchor = Math.ceil(attempts / entries.length);

  for (const anchor of entries) {
    const rest = entries.filter(e => e !== anchor);
    for (let i = 0; i < perAnchor; i++) {
      for (const dir of ['across', 'down']) {
        const result = tryLayout([anchor, ...shuffle(rest)], dir);
        if (!best || result.placed.length > best.placed.length) best = result;
        if (best.placed.length === entries.length) return best;
      }
    }
  }

  return best || { placed: [], unplaced: entries };
}
