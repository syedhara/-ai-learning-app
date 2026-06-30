import { GRID_ROWS, GRID_COLS } from '../data/puzzleData';
import { adminConfig } from '../data/adminConfig';

// Renders the crossword grid, the action buttons below it, and the legend.
// All game state and logic live in useCrosswordGame — this component is purely visual.
export default function CrosswordGrid({
  solvedGrid, userGrid, getCellStatus, breakSet, gridRef,
  onCellClick, onKeyDown, mode,
  onCheckAnswers, onRevealLetter, onRevealWord, onClear,
  legendDescription,
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

      {/* ── Action buttons ── */}
      <div className="grid-buttons">
        {(mode === 'checkAnswers' || mode === 'reveal') && (
          <button className="btn btn-check" onClick={onCheckAnswers}>Check Answers</button>
        )}
        {mode === 'reveal' && adminConfig.allowRevealLetter && (
          <button className="btn btn-reveal" onClick={onRevealLetter}>Reveal Letter</button>
        )}
        {mode === 'reveal' && adminConfig.allowRevealWord && (
          <button className="btn btn-reveal" onClick={onRevealWord}>Reveal Word</button>
        )}
        <button className="btn btn-clear" onClick={onClear}>Clear</button>
      </div>

      {/* ── Legend ── */}
      <div className="legend">
        <div className="legend-swatches">
          <span className="legend-item"><span className="legend-swatch swatch-correct" /> Correct</span>
          <span className="legend-item"><span className="legend-swatch swatch-incorrect" /> Wrong</span>
          <span className="legend-item"><span className="legend-swatch swatch-white" /> Not checked yet</span>
        </div>
        <p className="legend-description">{legendDescription}</p>
      </div>
    </div>
  );
}
