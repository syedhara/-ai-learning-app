import { GRID_ROWS, GRID_COLS } from '../data/puzzleData';

// Renders the crossword grid itself. Action buttons live in CrosswordActions
// so the grid, clues, and buttons can each sit in their own grid area and be
// reordered independently between desktop and mobile (see App.css).
export default function CrosswordGrid({
  solvedGrid, userGrid, getCellStatus, isPrefilled, breakSet, gridRef, inputRef,
  onCellClick, onKeyDown, onInputChange,
}) {
  return (
    <div className="puzzle-grid-wrap">
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
    </div>
  );
}
