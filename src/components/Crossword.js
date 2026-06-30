import { useCrosswordGame } from '../hooks/useCrosswordGame';
import { adminConfig } from '../data/adminConfig';
import CrosswordGrid from './CrosswordGrid';
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

      {/* ── Difficulty selector ── */}
      <div className="mode-selector">
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
          {/* ── Hint mode selector (hidden if only one mode available) ── */}
          {game.availableModes.length > 1 && (
            <div className="mode-selector">
              <span className="mode-label">How do you want to play?</span>
              <div className="mode-buttons">
                {adminConfig.allowCheckAnswers && (
                  <button
                    className={`mode-btn ${game.mode === 'checkAnswers' ? 'mode-btn-active' : ''}`}
                    onClick={() => game.switchMode('checkAnswers')}
                  >
                    Check Answers
                  </button>
                )}
                {adminConfig.allowLiveFeedback && (
                  <button
                    className={`mode-btn ${game.mode === 'liveFeedback' ? 'mode-btn-active' : ''}`}
                    onClick={() => game.switchMode('liveFeedback')}
                  >
                    Live Feedback
                  </button>
                )}
                {(adminConfig.allowRevealLetter || adminConfig.allowRevealWord) && (
                  <button
                    className={`mode-btn ${game.mode === 'reveal' ? 'mode-btn-active' : ''}`}
                    onClick={() => game.switchMode('reveal')}
                  >
                    Reveal on Demand
                  </button>
                )}
              </div>
            </div>
          )}

          {game.solved && (
            <div className="success-banner">Congratulations! You solved the puzzle!</div>
          )}

          <div className="puzzle-layout">
            <CrosswordGrid
              solvedGrid={game.solvedGrid}
              userGrid={game.userGrid}
              getCellStatus={game.getCellStatus}
              breakSet={game.breakSet}
              gridRef={game.gridRef}
              onCellClick={game.handleCellClick}
              onKeyDown={game.handleKeyDown}
              mode={game.mode}
              onCheckAnswers={game.checkAnswers}
              onRevealLetter={game.revealLetter}
              onRevealWord={game.revealWord}
              onClear={game.clearPuzzle}
              legendDescription={game.legendDescription}
            />
            <CrosswordClues
              acrossWords={game.acrossWords}
              downWords={game.downWords}
              activeClueNum={game.activeClueNum}
              direction={game.direction}
              onClueClick={game.handleClueClick}
            />
          </div>
        </>
      )}
    </div>
  );
}
