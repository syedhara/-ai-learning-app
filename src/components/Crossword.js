import { useCrosswordGame } from '../hooks/useCrosswordGame';
import CrosswordGrid from './CrosswordGrid';
import CrosswordActions from './CrosswordActions';
import CrosswordClues from './CrosswordClues';

const DIFFICULTY_LABELS = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

// ── Top-level crossword component ──────────────────────────────────────────────
// Handles layout and controls only. All game state and logic live in the hook.
export default function Crossword() {
  const game = useCrosswordGame();

  return (
    <div className="crossword-container">
      <h1 className="puzzle-title">Learn AI · Crossword</h1>
      <p className="puzzle-tagline">Test your AI vocabulary, one clue at a time</p>

      {/* ── Level selector (centered) ── */}
      <div className="level-selector">
        <span className="mode-label">Level:</span>
        <div className="mode-buttons">
          {Object.keys(DIFFICULTY_LABELS).map(level => (
            <button
              key={level}
              className={`mode-btn ${game.difficulty === level ? 'mode-btn-active' : ''}`}
              onClick={() => game.switchDifficulty(level)}
            >
              {DIFFICULTY_LABELS[level]}
            </button>
          ))}
        </div>
      </div>

      <p className="puzzle-subtitle">
        {game.generating
          ? `${DIFFICULTY_LABELS[game.difficulty]} · Building puzzle…`
          : `${DIFFICULTY_LABELS[game.difficulty]} · ${game.activeWords.length} Words · Click a cell, then type`}
      </p>

      {/* ── Loading spinner while the generator runs ── */}
      {game.generating ? (
        <div className="puzzle-generating">
          <span className="generating-spinner" />
          <span>Building {DIFFICULTY_LABELS[game.difficulty].toLowerCase()} puzzle…</span>
        </div>
      ) : (
        <>
          {game.solved && (
            <div className="success-banner">Congratulations! You solved the puzzle!</div>
          )}

          {/* ── Puzzle card: grid + clues ── */}
          <div className="puzzle-card">
            <div className="puzzle-layout">
              <CrosswordGrid
                solvedGrid={game.solvedGrid}
                userGrid={game.userGrid}
                getCellStatus={game.getCellStatus}
                isPrefilled={game.isPrefilled}
                breakSet={game.breakSet}
                gridRef={game.gridRef}
                inputRef={game.inputRef}
                onCellClick={game.handleCellClick}
                onKeyDown={game.handleKeyDown}
                onInputChange={game.handleInputChange}
              />
              <CrosswordClues
                acrossWords={game.acrossWords}
                downWords={game.downWords}
                activeClueNum={game.activeClueNum}
                direction={game.direction}
                onClueClick={game.handleClueClick}
              />
              <CrosswordActions
                mode={game.mode}
                onSwitchMode={game.switchMode}
                onCheckAnswers={game.checkAnswers}
                onRevealLetter={game.revealLetter}
                onRevealWord={game.revealWord}
                onClear={game.clearPuzzle}
                onNeedHelp={game.needHelp}
                helpUsed={game.helpUsed}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
