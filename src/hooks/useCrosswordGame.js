import { useState, useRef, useEffect, useMemo } from 'react';
import { wordListsByDifficulty, GRID_ROWS, GRID_COLS } from '../data/puzzleData';
import { generateCrossword } from '../utils/generateCrossword';
import { adminConfig } from '../data/adminConfig';

// Builds the answer key grid from a list of placed words.
// Called once after the generator finishes — not on every render.
function buildSolvedGrid(wordList) {
  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => null)
  );
  wordList.forEach(({ word, direction, row, col }) => {
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'down' ? row + i : row;
      const c = direction === 'across' ? col + i : col;
      if (!grid[r][c]) grid[r][c] = { letter: word[i], number: null, acrossNum: null, downNum: null };
    }
  });
  wordList.forEach(({ number, word, direction, row, col }) => {
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

function getDefaultMode() {
  const d = adminConfig.defaultMode;
  if (d === 'checkAnswers' && adminConfig.allowCheckAnswers) return 'checkAnswers';
  if (d === 'liveFeedback' && adminConfig.allowLiveFeedback) return 'liveFeedback';
  if (d === 'reveal' && (adminConfig.allowRevealLetter || adminConfig.allowRevealWord)) return 'reveal';
  if (adminConfig.allowCheckAnswers) return 'checkAnswers';
  if (adminConfig.allowLiveFeedback) return 'liveFeedback';
  return 'reveal';
}

const LEGEND_DESCRIPTIONS = {
  checkAnswers: 'Fill in the whole puzzle, then click Check Answers to see how you did.',
  liveFeedback: 'Each letter turns green or red the instant you type it.',
  reveal:       "Get stuck? Use Reveal Letter or Reveal Word. Click Check Answers when you're ready.",
};

// ── Custom hook — encapsulates all crossword state and game logic ──────────────
// Returns everything Crossword.js needs to pass down to its child components.
export function useCrosswordGame() {
  const [difficulty, setDifficulty]   = useState('beginner');
  const [generating, setGenerating]   = useState(true);
  const [activeWords, setActiveWords] = useState([]);
  const [solvedGrid, setSolvedGrid]   = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLS }, () => null))
  );
  const [userGrid, setUserGrid]       = useState(() =>
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(''))
  );
  const [selected, setSelected]       = useState({ row: 0, col: 0 });
  const [direction, setDirection]     = useState('across');
  const [checked, setChecked]         = useState(false);
  const [solved, setSolved]           = useState(false);
  const [mode, setMode]               = useState(getDefaultMode);

  const gridRef    = useRef(null);
  const inputRef   = useRef(null);
  // Tracks whether onKeyDown already processed a letter, so onChange doesn't double-fire it.
  // Desktop/iOS: onKeyDown fires first and sets this true; onChange skips.
  // Android: onKeyDown doesn't fire for IME letters, so onChange handles them.
  const letterHandledRef = useRef(false);

  const acrossWords = useMemo(() => activeWords.filter(w => w.direction === 'across'), [activeWords]);
  const downWords   = useMemo(() => activeWords.filter(w => w.direction === 'down'),   [activeWords]);

  // Positions of visual break markers for multi-word terms (e.g. DEEP|LEARNING).
  // breakAfter = letter index after which the thick bar is drawn.
  const breakSet = useMemo(() => {
    const set = {};
    activeWords.forEach(({ direction: dir, row, col, breakAfter }) => {
      if (!breakAfter) return;
      const idx = breakAfter - 1;
      const r   = dir === 'down'   ? row + idx : row;
      const c   = dir === 'across' ? col + idx : col;
      const key = `${r}-${c}`;
      if (!set[key]) set[key] = {};
      if (dir === 'across') set[key].right  = true;
      if (dir === 'down')   set[key].bottom = true;
    });
    return set;
  }, [activeWords]);

  // ── Generate a new puzzle whenever difficulty changes ──────────────────────
  useEffect(() => {
    setGenerating(true);
    setUserGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('')));
    setSelected({ row: 0, col: 0 });
    setDirection('across');
    setChecked(false);
    setSolved(false);

    // setTimeout(0) lets React paint the loading spinner before the generator
    // runs its synchronous search.
    const t = setTimeout(() => {
      const wordList = wordListsByDifficulty[difficulty];
      const { placed } = generateCrossword(wordList, 500);
      setActiveWords(placed);
      setSolvedGrid(buildSolvedGrid(placed));
      const firstAcross = placed.find(w => w.direction === 'across');
      if (firstAcross) {
        setSelected({ row: firstAcross.row, col: firstAcross.col });
        setDirection('across');
      }
      setGenerating(false);
    }, 0);

    return () => clearTimeout(t);
  }, [difficulty]);

  // Focus the hidden input after generation so keyboard navigation works immediately.
  // The hidden input triggers the mobile virtual keyboard; desktop ignores the opacity:0 element.
  useEffect(() => {
    if (!generating) inputRef.current?.focus();
  }, [generating]);

  // ── Game logic ─────────────────────────────────────────────────────────────
  function isPuzzleSolved(grid) {
    return activeWords.every(({ word, direction: dir, row, col }) => {
      for (let i = 0; i < word.length; i++) {
        const r = dir === 'down' ? row + i : row;
        const c = dir === 'across' ? col + i : col;
        if (grid[r][c] !== word[i]) return false;
      }
      return true;
    });
  }

  function switchDifficulty(newDifficulty) {
    if (newDifficulty !== difficulty) setDifficulty(newDifficulty);
  }

  function switchMode(newMode) {
    setMode(newMode);
    setChecked(false);
  }

  function handleCellClick(row, col) {
    const cell = solvedGrid[row][col];
    if (!cell) return;
    if (selected.row === row && selected.col === col) {
      setDirection(prev => {
        const next = prev === 'across' ? 'down' : 'across';
        if (next === 'across' && cell.acrossNum) return 'across';
        if (next === 'down'   && cell.downNum)   return 'down';
        return prev;
      });
    } else {
      setSelected({ row, col });
      if (!cell.acrossNum) setDirection('down');
      else if (!cell.downNum) setDirection('across');
    }
    inputRef.current?.focus();
  }

  function handleClueClick(wordDef) {
    setSelected({ row: wordDef.row, col: wordDef.col });
    setDirection(wordDef.direction);
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    const { row, col } = selected;
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      letterHandledRef.current = true; // tell onChange not to double-process this
      const newGrid = userGrid.map(r => [...r]);
      newGrid[row][col] = e.key.toUpperCase();
      setUserGrid(newGrid);
      setChecked(false);
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
        const pr = direction === 'down'   ? row - 1 : row;
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
    if (e.key === 'ArrowRight') { e.preventDefault(); setDirection('across'); jumpToNextCell(row, col, 0,  1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setDirection('across'); jumpToNextCell(row, col, 0, -1); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); setDirection('down');   jumpToNextCell(row, col,  1, 0); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setDirection('down');   jumpToNextCell(row, col, -1, 0); }
  }

  // Handles onChange on the hidden input — catches letter input on Android where
  // the virtual keyboard doesn't fire reliable onKeyDown events for letter keys.
  function handleInputChange(e) {
    const val = e.target.value;
    e.target.value = ''; // reset so next keystroke starts clean
    if (letterHandledRef.current) {
      letterHandledRef.current = false;
      return; // already handled by onKeyDown (desktop / iOS)
    }
    const letter = val.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase();
    if (!letter) return;
    const { row, col } = selected;
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = letter;
    setUserGrid(newGrid);
    setChecked(false);
    if (mode === 'liveFeedback' && isPuzzleSolved(newGrid)) setSolved(true);
    else setSolved(false);
    stepSelection(row, col, 1);
  }

  function stepSelection(row, col, delta) {
    const dr = direction === 'down'   ? delta : 0;
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

  function checkAnswers() {
    setChecked(true);
    if (isPuzzleSolved(userGrid)) setSolved(true);
  }

  function revealLetter() {
    const { row, col } = selected;
    if (!solvedGrid[row][col]) return;
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = solvedGrid[row][col].letter;
    setUserGrid(newGrid);
    if (isPuzzleSolved(newGrid)) setSolved(true);
  }

  function revealWord() {
    const selCell = solvedGrid[selected.row][selected.col];
    if (!selCell) return;
    const wordNum = direction === 'across' ? selCell.acrossNum : selCell.downNum;
    const wordDef = activeWords.find(w => w.number === wordNum);
    if (!wordDef) return;
    const newGrid = userGrid.map(r => [...r]);
    for (let i = 0; i < wordDef.word.length; i++) {
      const r = wordDef.direction === 'down'   ? wordDef.row + i : wordDef.row;
      const c = wordDef.direction === 'across' ? wordDef.col + i : wordDef.col;
      newGrid[r][c] = wordDef.word[i];
    }
    setUserGrid(newGrid);
    if (isPuzzleSolved(newGrid)) setSolved(true);
  }

  function clearPuzzle() {
    setUserGrid(Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill('')));
    setChecked(false);
    setSolved(false);
  }

  function getCellStatus(row, col) {
    const cell = solvedGrid[row][col];
    if (!cell) return 'black';
    if (selected.row === row && selected.col === col) return 'selected';
    if (isInSelectedWord(row, col)) return 'highlighted';
    if (userGrid[row][col]) {
      const showColour = mode === 'liveFeedback' || checked;
      if (showColour) return userGrid[row][col] === cell.letter ? 'correct' : 'incorrect';
    }
    return 'white';
  }

  function isInSelectedWord(row, col) {
    const cell    = solvedGrid[row][col];
    const selCell = solvedGrid[selected.row][selected.col];
    if (!cell || !selCell) return false;
    if (direction === 'across') {
      return row === selected.row && selCell.acrossNum !== null && cell.acrossNum === selCell.acrossNum;
    }
    return col === selected.col && selCell.downNum !== null && cell.downNum === selCell.downNum;
  }

  const activeCell    = solvedGrid[selected.row]?.[selected.col];
  const activeClueNum = direction === 'across' ? activeCell?.acrossNum : activeCell?.downNum;

  const availableModes = [
    adminConfig.allowCheckAnswers && 'checkAnswers',
    adminConfig.allowLiveFeedback && 'liveFeedback',
    (adminConfig.allowRevealLetter || adminConfig.allowRevealWord) && 'reveal',
  ].filter(Boolean);

  return {
    // Top-level controls (for Crossword.js)
    difficulty, generating, activeWords,
    solved, mode, availableModes,
    switchDifficulty, switchMode,
    // Grid component props
    solvedGrid, userGrid, getCellStatus, breakSet, gridRef, inputRef,
    handleCellClick, handleKeyDown, handleInputChange,
    checkAnswers, revealLetter, revealWord, clearPuzzle,
    legendDescription: LEGEND_DESCRIPTIONS[mode],
    // Clues component props
    acrossWords, downWords, activeClueNum,
    direction, handleClueClick,
  };
}
