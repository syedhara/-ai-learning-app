import React, { useState, useRef, useEffect } from 'react';
import { words, GRID_ROWS, GRID_COLS } from '../data/puzzleData';

// ── Build the answer grid once when the app loads ─────────────────────────────
// This turns the word list into a 2D grid where each cell knows its correct
// letter, clue number, and which across/down word it belongs to.
function buildSolvedGrid() {
  // Start with all cells as null (black squares)
  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );

  // First pass: fill in letters from each word
  words.forEach(({ word, direction, row, col }) => {
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;
      if (!grid[r][c]) {
        grid[r][c] = { letter: word[i], number: null, acrossNum: null, downNum: null };
      }
    }
  });

  // Second pass: assign clue numbers and track which word each cell belongs to
  words.forEach(({ number, word, direction, row, col }) => {
    // The starting cell of each word gets the clue number
    grid[row][col].number = number;

    for (let i = 0; i < word.length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;
      if (direction === 'across') grid[r][c].acrossNum = number;
      else grid[r][c].downNum = number;
    }
  });

  return grid;
}

// Build these once at module load — they never change
const solvedGrid = buildSolvedGrid();
const acrossWords = words.filter(w => w.direction === 'across');
const downWords = words.filter(w => w.direction === 'down');

// ── Main Crossword Component ───────────────────────────────────────────────────
export default function Crossword() {
  // What the user has typed — a 2D array of letters (empty string = blank)
  const [userGrid, setUserGrid] = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(''))
  );

  // Which cell is currently selected
  const [selected, setSelected] = useState({ row: 0, col: 0 });

  // Are we filling across or down?
  const [direction, setDirection] = useState('across');

  // Has the user clicked "Check Answers"?
  const [checked, setChecked] = useState(false);

  // Did the user solve it correctly?
  const [solved, setSolved] = useState(false);

  // The grid div captures keyboard events
  const gridRef = useRef(null);

  // Focus the grid on first load so user can type immediately
  useEffect(() => {
    gridRef.current?.focus();
  }, []);

  // ── Cell click handler ──────────────────────────────────────────────────────
  function handleCellClick(row, col) {
    const cell = solvedGrid[row][col];
    if (!cell) return; // ignore black squares

    if (selected.row === row && selected.col === col) {
      // Clicking the same cell toggles direction (if both directions are available)
      setDirection(prev => {
        const next = prev === 'across' ? 'down' : 'across';
        if (next === 'across' && cell.acrossNum) return 'across';
        if (next === 'down' && cell.downNum) return 'down';
        return prev; // can't switch, stay put
      });
    } else {
      setSelected({ row, col });
      // Auto-select a valid direction for this cell
      if (!cell.acrossNum) setDirection('down');
      else if (!cell.downNum) setDirection('across');
      // else keep the current direction
    }

    gridRef.current?.focus();
  }

  // ── Clue click handler ──────────────────────────────────────────────────────
  function handleClueClick(wordDef) {
    setSelected({ row: wordDef.row, col: wordDef.col });
    setDirection(wordDef.direction);
    gridRef.current?.focus();
  }

  // ── Keyboard handler ────────────────────────────────────────────────────────
  function handleKeyDown(e) {
    const { row, col } = selected;

    // Letter key: fill the cell and move forward one step
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const newGrid = userGrid.map(r => [...r]);
      newGrid[row][col] = e.key.toUpperCase();
      setUserGrid(newGrid);
      setChecked(false);
      setSolved(false);
      stepSelection(row, col, 1);
      return;
    }

    // Backspace: clear current cell, step back one
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newGrid = userGrid.map(r => [...r]);
      if (newGrid[row][col]) {
        // Cell has a letter — just clear it
        newGrid[row][col] = '';
      } else {
        // Cell is empty — go back and clear the previous cell
        const pr = direction === 'down' ? row - 1 : row;
        const pc = direction === 'across' ? col - 1 : col;
        if (pr >= 0 && pc >= 0 && solvedGrid[pr]?.[pc]) {
          newGrid[pr][pc] = '';
          setSelected({ row: pr, col: pc });
        }
      }
      setUserGrid(newGrid);
      setChecked(false);
      setSolved(false);
      return;
    }

    // Arrow keys: navigate and switch direction
    if (e.key === 'ArrowRight') { e.preventDefault(); setDirection('across'); jumpToNextCell(row, col, 0, 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setDirection('across'); jumpToNextCell(row, col, 0, -1); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setDirection('down');   jumpToNextCell(row, col, 1, 0); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setDirection('down');   jumpToNextCell(row, col, -1, 0); }
  }

  // Move one step forward or back while typing (stops at word boundary)
  function stepSelection(row, col, delta) {
    const dr = direction === 'down' ? delta : 0;
    const dc = direction === 'across' ? delta : 0;
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS && solvedGrid[nr][nc]) {
      setSelected({ row: nr, col: nc });
    }
  }

  // Arrow key navigation — skip over black squares to the next white cell
  function jumpToNextCell(row, col, dr, dc) {
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
      if (solvedGrid[r][c]) { setSelected({ row: r, col: c }); return; }
      r += dr; c += dc;
    }
  }

  // ── Check answers ───────────────────────────────────────────────────────────
  function checkAnswers() {
    setChecked(true);
    const allCorrect = words.every(({ word, direction, row, col }) => {
      for (let i = 0; i < word.length; i++) {
        const r = direction === 'down' ? row + i : row;
        const c = direction === 'across' ? col + i : col;
        if (userGrid[r][c] !== word[i]) return false;
      }
      return true;
    });
    setSolved(allCorrect);
  }

  // ── Clear puzzle ─────────────────────────────────────────────────────────────
  function clearPuzzle() {
    setUserGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('')));
    setChecked(false);
    setSolved(false);
  }

  // ── Cell visual state ───────────────────────────────────────────────────────
  // Returns a CSS class suffix: black, selected, highlighted, correct, incorrect, or white
  function getCellStatus(row, col) {
    const cell = solvedGrid[row][col];
    if (!cell) return 'black';
    if (selected.row === row && selected.col === col) return 'selected';
    if (isInSelectedWord(row, col)) return 'highlighted';
    if (checked && userGrid[row][col]) {
      return userGrid[row][col] === cell.letter ? 'correct' : 'incorrect';
    }
    return 'white';
  }

  // Is this cell part of the currently selected word?
  function isInSelectedWord(row, col) {
    const cell = solvedGrid[row][col];
    const selCell = solvedGrid[selected.row][selected.col];
    if (!cell || !selCell) return false;

    if (direction === 'across') {
      return row === selected.row
        && selCell.acrossNum !== null
        && cell.acrossNum === selCell.acrossNum;
    }
    return col === selected.col
      && selCell.downNum !== null
      && cell.downNum === selCell.downNum;
  }

  // Figure out which clue is active (to highlight it in the clue list)
  const activeCell = solvedGrid[selected.row]?.[selected.col];
  const activeClueNum = direction === 'across' ? activeCell?.acrossNum : activeCell?.downNum;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="crossword-container">
      <h1 className="puzzle-title">AI Concepts Crossword</h1>
      <p className="puzzle-subtitle">Beginner Level · 10 Words · Click a cell, then type</p>

      {solved && (
        <div className="success-banner">
          Congratulations! You solved the puzzle!
        </div>
      )}

      <div className="puzzle-layout">

        {/* Left side: grid + buttons */}
        <div>
          <div
            ref={gridRef}
            className="grid"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 36px)` }}
          >
            {Array.from({ length: GRID_ROWS }, (_, r) =>
              Array.from({ length: GRID_COLS }, (_, c) => {
                const status = getCellStatus(r, c);
                const cell = solvedGrid[r][c];
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`cell cell-${status}`}
                    onClick={() => handleCellClick(r, c)}
                  >
                    {/* Clue number in top-left corner */}
                    {cell?.number && (
                      <span className="cell-number">{cell.number}</span>
                    )}
                    {/* Letter the user typed */}
                    {cell && (
                      <span className="cell-letter">{userGrid[r][c]}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="grid-buttons">
            <button className="btn btn-check" onClick={checkAnswers}>
              Check Answers
            </button>
            <button className="btn btn-clear" onClick={clearPuzzle}>
              Clear
            </button>
          </div>
        </div>

        {/* Right side: clue lists */}
        <div className="clues-panel">
          <div className="clues-section">
            <h3>Across</h3>
            {acrossWords.map(w => (
              <div
                key={w.number}
                className={`clue ${activeClueNum === w.number && direction === 'across' ? 'clue-active' : ''}`}
                onClick={() => handleClueClick(w)}
              >
                <span className="clue-number">{w.number}.</span> {w.clue}
              </div>
            ))}
          </div>

          <div className="clues-section">
            <h3>Down</h3>
            {downWords.map(w => (
              <div
                key={w.number}
                className={`clue ${activeClueNum === w.number && direction === 'down' ? 'clue-active' : ''}`}
                onClick={() => handleClueClick(w)}
              >
                <span className="clue-number">{w.number}.</span> {w.clue}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
