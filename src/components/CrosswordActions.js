// Mode buttons + Clear + Need Help + Reveal sub-buttons, below the grid on
// desktop and below the clues on mobile (see .puzzle-layout grid-template-areas
// in App.css — this lives in its own grid area so it can be reordered per
// breakpoint independently of the grid and clues).
import { adminConfig } from '../data/adminConfig';

export default function CrosswordActions({
  mode, onSwitchMode, onCheckAnswers, onRevealLetter, onRevealWord,
  onClear, onNeedHelp, helpUsed,
}) {
  return (
    <div className="puzzle-actions">
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

      {adminConfig.prefillPercentage > 0 && !helpUsed && (
        <div className="need-help-bar">
          <button className="btn btn-need-help" onClick={onNeedHelp}>Need Help</button>
          <span className="need-help-caption">Reveal some random letters</span>
        </div>
      )}

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

      {/* What each button does — placed after the buttons here so it lands
          below them on desktop and, since this whole component is the last
          grid area on mobile, at the very bottom of the page there too. */}
      <div className="button-help">
        <p className="button-help-title">What these buttons do</p>
        <ul className="button-help-list">
          {adminConfig.allowCheckAnswers && (
            <li><strong>Check Answers</strong> — colors your letters green or red when you click it</li>
          )}
          {adminConfig.allowLiveFeedback && (
            <li><strong>Live Feedback</strong> — colors each letter the instant you type it</li>
          )}
          {(adminConfig.allowRevealLetter || adminConfig.allowRevealWord) && (
            <li><strong>Reveal on Demand</strong> — turns on the Reveal Letter / Reveal Word buttons below</li>
          )}
          {adminConfig.prefillPercentage > 0 && (
            <li><strong>Need Help</strong> — reveals a few random letters to start you off, once per puzzle</li>
          )}
          <li><strong>Clear</strong> — wipes your answers (keeps any revealed letters)</li>
        </ul>
        <p className="button-help-warning">
          Heads up: using Reveal Letter, Reveal Word, or Need Help marks that word as
          assisted — it won't count as correct in your stats.
        </p>
      </div>
    </div>
  );
}
