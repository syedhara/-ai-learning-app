import { useState } from 'react';
import Flashcard from './Flashcard';

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

      <Flashcard word={current} revealed={isRevealed} onToggle={toggleReveal} />

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

