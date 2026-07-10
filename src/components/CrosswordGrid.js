import { GRID_ROWS, GRID_COLS } from '../data/puzzleData';
import { adminConfig } from '../data/adminConfig';

// Renders the crossword grid and the action bar below it.
// All game state and logic live in useCrosswordGame — this component is purely visual.
export default function CrosswordGrid({
  solvedGrid, userGrid, getCellStatus, isPrefilled, breakSet, gridRef, inputRef,
  onCellClick, onKeyDown, onInputChange, mode, onSwitchMode,
  onCheckAnswers, onRevealLetter, onRevealWord, onClear, onNeedHelp, helpUsed,
}) {
  return (
    <div style={{ position: 'relative' }}>
      {/*
        Hidden input — focused on cell tap so the mobile virtual keyboard pops up.
        font-size:16px prevents iOS from zooming the page on focus.
        Android types via onChange; desktop/iOS type via onKeyDown.
      */}
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-hidden="true"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onChange={onInputChange}
        style={{
          position: 'absolute',
          opacity: 0,
          width: '1px',
          height: '1px',
          top: 0,
          left: 0,
          fontSize: '16px',
          pointerEvents: 'none',
        }}
      />
      {/* ── Grid ──
        Only the column count comes from JS (--grid-cols). Actual cell size
        (--cell-size) is set entirely by CSS media queries, so the grid
        tracks and the .cell boxes always agree and shrink together on small
        screens. The wrapper scrolls horizontally as a last-resort fallback
        rather than silently clipping on very narrow phones. */}
      <div className="grid-scroll">
        <div
          ref={gridRef}
          className="grid"
          tabIndex={0}
          onKeyDown={onKeyDown}
          style={{ '--grid-cols': GRID_COLS }}
        >
          {Array.from({ length: GRID_ROWS }, (_, r) =>
            Array.from({ length: GRID_COLS }, (_, c) => {
              const status    = getCellStatus(r, c);
              const cell      = solvedGrid[r][c];
              const marker    = breakSet[`${r}-${c}`];
              const prefilled = isPrefilled(r, c);
              return (
                <div
                  key={`${r}-${c}`}
                  className={`cell cell-${status}${prefilled ? ' cell-prefilled' : ''}`}
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

      {/* ── Need Help — own row so it doesn't crowd/shrink the buttons above ── */}
      {adminConfig.prefillPercentage > 0 && !helpUsed && (
        <div className="need-help-bar">
          <button className="btn btn-need-help" onClick={onNeedHelp}>Need Help</button>
          <span className="need-help-caption">Reveal some random letters</span>
        </div>
      )}

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
