import { useState } from 'react';

// Multi-word terms are stored without a space (e.g. "DEEPLEARNING") plus a
// breakAfter letter-count. These helpers turn that back into readable text —
// formatWord() for the revealed answer, formatBlanks() for the hidden one.
function formatWord(word, breakAfter) {
  if (!breakAfter) return word;
  return `${word.slice(0, breakAfter)} ${word.slice(breakAfter)}`;
}

function formatBlanks(word, breakAfter) {
  const dashes = word.split('').map(() => '_').join(' ');
  if (!breakAfter) return dashes;
  // breakAfter counts letters, and each letter became "_ " (2 chars) in dashes.
  const splitAt = breakAfter * 2 - 1;
  return `${dashes.slice(0, splitAt)}   ${dashes.slice(splitAt)}`;
}

// ── Word review (flashcards) ────────────────────────────────────────────────
// Shown right after a puzzle is generated but before the grid appears.
// Testers with no prior AI vocabulary had nothing to recall once dropped
// straight into "Check Answers" mode — this lets them look over the exact
// words that will appear in *this* puzzle first, then start when ready.
export default function WordReview({ words, difficultyLabel, onStart }) {
  const [index, setIndex]       = useState(0);
  const [revealed, setRevealed] = useState(() => new Set());

  if (words.length === 0) return null;

  const current    = words[index];
  const isRevealed = revealed.has(index);

  function toggleReveal() {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function goTo(newIndex) {
    setIndex((newIndex + words.length) % words.length);
  }

  return (
    <div className="puzzle-card review-card">
      <div className="review-header">
        <p className="review-intro">
          Here are the {words.length} words in this {difficultyLabel.toLowerCase()} puzzle.
          Look them over, then start when you're ready.
        </p>
        <button className="link-btn review-skip-btn" onClick={onStart}>
          Skip review &rarr;
        </button>
      </div>

      <div
        className="flashcard"
        role="button"
        tabIndex={0}
        onClick={toggleReveal}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleReveal(); } }}
      >
        <span className="flashcard-subject">{current.subject}</span>
        <p className="flashcard-clue">{current.clue}</p>
        <div className={`flashcard-answer${isRevealed ? ' flashcard-answer-revealed' : ''}`}>
          {isRevealed ? formatWord(current.word, current.breakAfter) : formatBlanks(current.word, current.breakAfter)}
        </div>
        <span className="flashcard-tap-hint">{isRevealed ? 'Tap to hide' : 'Tap to reveal'}</span>
      </div>

      <div className="flashcard-nav">
        <button className="btn btn-clear" onClick={() => goTo(index - 1)}>&lsaquo; Prev</button>
        <span className="flashcard-count">{index + 1} / {words.length}</span>
        <button className="btn btn-clear" onClick={() => goTo(index + 1)}>Next &rsaquo;</button>
      </div>

      <button className="btn btn-primary review-start-btn" onClick={onStart}>
        Start Puzzle
      </button>
    </div>
  );
}
