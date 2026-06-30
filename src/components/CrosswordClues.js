// Renders the Across and Down clue panels.
// Clicking a clue moves the cursor to the start of that word in the grid.
export default function CrosswordClues({ acrossWords, downWords, activeClueNum, direction, onClueClick }) {
  return (
    <div className="clues-panel">
      <div className="clues-section">
        <h3>Across</h3>
        {acrossWords.map(w => (
          <div
            key={w.number}
            className={`clue ${activeClueNum === w.number && direction === 'across' ? 'clue-active' : ''}`}
            onClick={() => onClueClick(w)}
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
            onClick={() => onClueClick(w)}
          >
            <span className="clue-number">{w.number}.</span> {w.clue}
          </div>
        ))}
      </div>
    </div>
  );
}
