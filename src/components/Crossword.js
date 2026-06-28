import React, { useState, useRef, useEffect } from 'react';
import { words, GRID_ROWS, GRID_COLS } from '../data/puzzleData';
import { adminConfig } from '../data/adminConfig';

// ── Build the answer grid once when the app loads ─────────────────────────────
function buildSolvedGrid() {
  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );

  words.forEach(({ word, direction, row, col }) => {
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;
      if (!grid[r][c]) {
        grid[r][c] = { letter: word[i], number: null, acrossNum: null, downNum: null };
      }
    }
  });

  words.forEach(({ number, word, direction, row, col }) => {
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

const solvedGrid = buildSolvedGrid();
const acrossWords = words.filter(w => w.direction === 'across');
const downWords = words.filter(w => w.direction === 'down');

// Work out which mode to start in based on admin config
function getDefaultMode() {
  const d = adminConfig.defaultMode;
  if (d === 'checkAnswers' && adminConfig.allowCheckAnswers) return 'checkAnswers';
  if (d === 'liveFeedback' && adminConfig.allowLiveFeedback) return 'liveFeedback';
  if (d === 'reveal' && (adminConfig.allowRevealLetter || adminConfig.allowRevealWord)) return 'reveal';
  // Fallback to first available mode
  if (adminConfig.allowCheckAnswers) return 'checkAnswers';
  if (adminConfig.allowLiveFeedback) return 'liveFeedback';
  return 'reveal';
}

// ── Main Crossword Component ───────────────────────────────────────────────────
export default function Crossword() {
  const [userGrid, setUserGrid] = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(''))
  );
  const [selected, setSelected]   = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('across');
  const [checked, setChecked]     = useState(false);
  const [solved, setSolved]       = useState(false);
  const [mode, setMode]           = useState(getDefaultMode);

  const gridRef = useRef(null);

  useEffect(() => {
    gridRef.current?.focus();
  }, []);

  // ── Check if every cell is correct (works for any grid snapshot) ───────────
  function isPuzzleSolved(grid) {
    return words.every(({ word, direction, row, col }) => {
      for (let i = 0; i < word.length; i++) {
        const r = direction === 'down' ? row + i : row;
        const c = direction === 'across' ? col + i : col;
        if (grid[r][c] !== word[i]) return false;
      }
      return true;
    });
  }

  // ── Mode switcher ──────────────────────────────────────────────────────────
  function switchMode(newMode) {
    setMode(newMode);
    setChecked(false); // clear any red/green when switching modes
  }

  // ── Cell click ─────────────────────────────────────────────────────────────
  function handleCellClick(row, col) {
    const cell = solvedGrid[row][col];
    if (!cell) return;

    if (selected.row === row && selected.col === col) {
      setDirection(prev => {
        const next = prev === 'across' ? 'down' : 'across';
        if (next === 'across' && cell.acrossNum) return 'across';
        if (next === 'down' && cell.downNum) return 'down';
        return prev;
      });
    } else {
      setSelected({ row, col });
      if (!cell.acrossNum) setDirection('down');
      else if (!cell.downNum) setDirection('across');
    }

    gridRef.current?.focus();
  }

  // ── Clue click ─────────────────────────────────────────────────────────────
  function handleClueClick(wordDef) {
    setSelected({ row: wordDef.row, col: wordDef.col });
    setDirection(wordDef.direction);
    gridRef.current?.focus();
  }

  // ── Keyboard ────────────────────────────────────────────────────────────────
  function handleKeyDown(e) {
    const { row, col } = selected;

    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      const newGrid = userGrid.map(r => [...r]);
      newGrid[row][col] = e.key.toUpperCase();
      setUserGrid(newGrid);
      setChecked(false);
      // In live feedback mode, auto-detect solve after each keystroke
      if (mode === 'liveFeedback' && isPuzzleSolved(newGrid)) setSolved(true);
      else setSolved(false);
      stepSelection(row, col, 1);
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newGrid = userGrid.map(r => [...r]);
      if (newGrid[row][col]) {
        newGrid[row][col] = '';
      } else {
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

    if (e.key === 'ArrowRight') { e.preventDefault(); setDirection('across'); jumpToNextCell(row, col, 0, 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setDirection('across'); jumpToNextCell(row, col, 0, -1); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setDirection('down');   jumpToNextCell(row, col, 1, 0); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setDirection('down');   jumpToNextCell(row, col, -1, 0); }
  }

  function stepSelection(row, col, delta) {
    const dr = direction === 'down' ? delta : 0;
    const dc = direction === 'across' ? delta : 0;
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS && solvedGrid[nr][nc]) {
      setSelected({ row: nr, col: nc });
    }
  }

  function jumpToNextCell(row, col, dr, dc) {
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
      if (solvedGrid[r][c]) { setSelected({ row: r, col: c }); return; }
      r += dr; c += dc;
    }
  }

  // ── Check Answers (Mode 1 + Reveal mode) ──────────────────────────────────
  function checkAnswers() {
    setChecked(true);
    if (isPuzzleSolved(userGrid)) setSolved(true);
  }

  // ── Reveal Letter (Mode 3a) ────────────────────────────────────────────────
  function revealLetter() {
    const { row, col } = selected;
    if (!solvedGrid[row][col]) return;
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = solvedGrid[row][col].letter;
    setUserGrid(newGrid);
    if (isPuzzleSolved(newGrid)) setSolved(true);
  }

  // ── Reveal Word (Mode 3b) ──────────────────────────────────────────────────
  function revealWord() {
    const selCell = solvedGrid[selected.row][selected.col];
    if (!selCell) return;
    const wordNum = direction === 'across' ? selCell.acrossNum : selCell.downNum;
    const wordDef = words.find(w => w.number === wordNum);
    if (!wordDef) return;

    const newGrid = userGrid.map(r => [...r]);
    for (let i = 0; i < wordDef.word.length; i++) {
      const r = wordDef.direction === 'down' ? wordDef.row + i : wordDef.row;
      const c = wordDef.direction === 'across' ? wordDef.col + i : wordDef.col;
      newGrid[r][c] = wordDef.word[i];
    }
    setUserGrid(newGrid);
    if (isPuzzleSolved(newGrid)) setSolved(true);
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  function clearPuzzle() {
    setUserGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('')));
    setChecked(false);
    setSolved(false);
  }

  // ── Cell colour ────────────────────────────────────────────────────────────
  function getCellStatus(row, col) {
    const cell = solvedGrid[row][col];
    if (!cell) return 'black';
    if (selected.row === row && selected.col === col) return 'selected';
    if (isInSelectedWord(row, col)) return 'highlighted';

    if (userGrid[row][col]) {
      // Live feedback: always colour filled cells
      // Check Answers / Reveal: only colour after Check Answers clicked
      const showColour = mode === 'liveFeedback' || checked;
      if (showColour) {
        return userGrid[row][col] === cell.letter ? 'correct' : 'incorrect';
      }
    }
    return 'white';
  }

  function isInSelectedWord(row, col) {
    const cell = solvedGrid[row][col];
    const selCell = solvedGrid[selected.row][selected.col];
    if (!cell || !selCell) return false;
    if (direction === 'across') {
      return row === selected.row && selCell.acrossNum !== null && cell.acrossNum === selCell.acrossNum;
    }
    return col === selected.col && selCell.downNum !== null && cell.downNum === selCell.downNum;
  }

  const activeCell = solvedGrid[selected.row]?.[selected.col];
  const activeClueNum = direction === 'across' ? activeCell?.acrossNum : activeCell?.downNum;

  // How many modes does the admin allow? If only one, hide the selector.
  const availableModes = [
    adminConfig.allowCheckAnswers && 'checkAnswers',
    adminConfig.allowLiveFeedback && 'liveFeedback',
    (adminConfig.allowRevealLetter || adminConfig.allowRevealWord) && 'reveal',
  ].filter(Boolean);

  // Legend description text changes per mode
  const legendDescriptions = {
    checkAnswers: 'Fill in the whole puzzle, then click Check Answers to see how you did.',
    liveFeedback: 'Each letter turns green or red the instant you type it.',
    reveal:       'Get stuck? Use Reveal Letter or Reveal Word. Click Check Answers when you\'re ready.',
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="crossword-container">
      <h1 className="puzzle-title">AI Concepts Crossword</h1>
      <p className="puzzle-subtitle">Beginner Level · 10 Words · Click a cell, then type</p>

      {/* ── Mode selector (hidden if only one mode is available) ── */}
      {availableModes.length > 1 && (
        <div className="mode-selector">
          <span className="mode-label">How do you want to play?</span>
          <div className="mode-buttons">
            {adminConfig.allowCheckAnswers && (
              <button
                className={`mode-btn ${mode === 'checkAnswers' ? 'mode-btn-active' : ''}`}
                onClick={() => switchMode('checkAnswers')}
              >
                Check Answers
              </button>
            )}
            {adminConfig.allowLiveFeedback && (
              <button
                className={`mode-btn ${mode === 'liveFeedback' ? 'mode-btn-active' : ''}`}
                onClick={() => switchMode('liveFeedback')}
              >
                Live Feedback
              </button>
            )}
            {(adminConfig.allowRevealLetter || adminConfig.allowRevealWord) && (
              <button
                className={`mode-btn ${mode === 'reveal' ? 'mode-btn-active' : ''}`}
                onClick={() => switchMode('reveal')}
              >
                Reveal on Demand
              </button>
            )}
          </div>
        </div>
      )}

      {solved && (
        <div className="success-banner">
          Congratulations! You solved the puzzle!
        </div>
      )}

      <div className="puzzle-layout">

        {/* ── Grid + buttons + legend ── */}
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
                    {cell?.number && <span className="cell-number">{cell.number}</span>}
                    {cell && <span className="cell-letter">{userGrid[r][c]}</span>}
                  </div>
                );
              })
            )}
          </div>

          {/* ── Action buttons (change based on mode) ── */}
          <div className="grid-buttons">
            {(mode === 'checkAnswers' || mode === 'reveal') && (
              <button className="btn btn-check" onClick={checkAnswers}>
                Check Answers
              </button>
            )}
            {mode === 'reveal' && adminConfig.allowRevealLetter && (
              <button className="btn btn-reveal" onClick={revealLetter}>
                Reveal Letter
              </button>
            )}
            {mode === 'reveal' && adminConfig.allowRevealWord && (
              <button className="btn btn-reveal" onClick={revealWord}>
                Reveal Word
              </button>
            )}
            <button className="btn btn-clear" onClick={clearPuzzle}>
              Clear
            </button>
          </div>

          {/* ── Legend ── */}
          <div className="legend">
            <div className="legend-swatches">
              <span className="legend-item">
                <span className="legend-swatch swatch-correct"></span> Correct
              </span>
              <span className="legend-item">
                <span className="legend-swatch swatch-incorrect"></span> Wrong
              </span>
              <span className="legend-item">
                <span className="legend-swatch swatch-white"></span> Not checked yet
              </span>
            </div>
            <p className="legend-description">{legendDescriptions[mode]}</p>
          </div>
        </div>

        {/* ── Clues panel ── */}
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
