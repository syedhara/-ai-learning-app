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
    </div>
  );
}
