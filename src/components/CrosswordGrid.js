import { GRID_ROWS, GRID_COLS } from '../data/puzzleData';
import { adminConfig } from '../data/adminConfig';

// Renders the crossword grid and the action bar below it.
// All game state and logic live in useCrosswordGame — this component is purely visual.
export default function CrosswordGrid({
  solvedGrid, userGrid, getCellStatus, breakSet, gridRef,
  onCellClick, onKeyDown, mode, onSwitchMode,
  onCheckAnswers, onRevealLetter, onRevealWord, onClear,
}) {
  return (
    <div>
      {/* ── Grid ── */}
      <div
        ref={gridRef}
        className="grid"
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 36px)` }}
      >
        {Array.from({ length: GRID_ROWS }, (_, r) =>
          Array.from({ length: GRID_COLS }, (_, c) => {
            const status = getCellStatus(r, c);
            const cell   = solvedGrid[r][c];
            const marker = breakSet[`${r}-${c}`];
            return (
              <div
                key={`${r}-${c}`}
                className={`cell cell-${status}`}
                onClick={() => onCellClick(r, c)}
              >
                {cell?.number && <span className="cell-number">{cell.number}</span>}
                {cell && <span className="cell-letter">{userGrid[r][c]}</span>}
                {marker?.right  && <span className="word-break word-break-right" />}
                {marker?.bottom && <span className="word-break word-break-bottom" />}
              </div>
            );
          })
        )}
      </div>

      {/* ── Action bar: mode buttons + clear in one row ── */}
      <div className="action-bar">
        {adminConfig.allowCheckAnswers && (
          <button className="btn btn-check" onClick={onCheckAnswers}>
            Check Answers
          </button>
        )}
        {adminConfig.allowLiveFeedback && (
          <button
            className={`btn btn-live${mode === 'liveFeedback' ? ' btn-mode-active' : ''}`}
            onClick={() => onSwitchMode(mode === 'liveFeedback' ? 'checkAnswers' : 'liveFeedback')}
          >
            Live Feedback
          </button>
        )}
        {(adminConfig.allowRevealLetter || adminConfig.allowRevealWord) && (
          <button
            className={`btn btn-reveal-toggle${mode === 'reveal' ? ' btn-mode-active' : ''}`}
            onClick={() => onSwitchMode(mode === 'reveal' ? 'checkAnswers' : 'reveal')}
          >
            Reveal on Demand
          </button>
        )}
        <button className="btn btn-clear" onClick={onClear}>Clear</button>
      </div>

      {/* ── Reveal sub-buttons — appear when Reveal on Demand is active ── */}
      {mode === 'reveal' && (
        <div className="reveal-sub-bar">
          {adminConfig.allowRevealLetter && (
            <button className="btn btn-reveal-sub" onClick={onRevealLetter}>Reveal Letter</button>
          )}
          {adminConfig.allowRevealWord && (
            <button className="btn btn-reveal-sub" onClick={onRevealWord}>Reveal Word</button>
          )}
        </div>
      )}
    </div>
  );
}
