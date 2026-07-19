import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allWords, subjects } from '../data/puzzleData';
import WordFilterBar from '../components/WordFilterBar';
import Flashcard from '../components/Flashcard';

// ── Flashcards ───────────────────────────────────────────────────────────────
// Standalone study page — browse the whole word bank (filtered by difficulty
// and/or subject) as a deck of flashcards, one at a time, self-testing by
// tapping to reveal/hide each word. Separate from the pre-puzzle word review,
// which only ever shows the words placed in that one generated puzzle.
export default function FlashcardsPage() {
  const [difficulty, setDifficulty] = useState('all');
  const [subject, setSubject]       = useState('all');
  const [index, setIndex]           = useState(0);
  const [revealed, setRevealed]     = useState(() => new Set());

  const deck = useMemo(() => allWords.filter(w =>
    (difficulty === 'all' || w.difficulty === difficulty) &&
    (subject === 'all' || w.subject === subject)
  ), [difficulty, subject]);

  // Filters changed — the old index/reveal state no longer lines up with the new deck.
  useEffect(() => {
    setIndex(0);
    setRevealed(new Set());
  }, [difficulty, subject]);

  function toggleReveal() {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function goTo(newIndex) {
    if (deck.length === 0) return;
    setIndex((newIndex + deck.length) % deck.length);
  }

  return (
    <div className="review-container">
      <h1 className="puzzle-title">Flashcards</h1>
      <p className="puzzle-tagline">Flip through AI terms one at a time and test yourself.</p>

      <div className="review-nav-links">
        <Link to="/review" className="link-btn">&larr; Back to Review Vocabulary</Link>
        <Link to="/puzzle" className="link-btn">Crossword Puzzle &rarr;</Link>
      </div>

      <WordFilterBar
        difficulty={difficulty} onDifficultyChange={setDifficulty}
        subject={subject} onSubjectChange={setSubject}
        subjects={subjects}
      />

      <div className="puzzle-card review-card">
        {deck.length === 0 ? (
          <p className="review-intro">No words match those filters — try a different difficulty or subject.</p>
        ) : (
          <>
            <Flashcard word={deck[index]} revealed={revealed.has(index)} onToggle={toggleReveal} />
            <div className="flashcard-nav">
              <button className="btn btn-clear" onClick={() => goTo(index - 1)}>&lsaquo; Prev</button>
              <span className="flashcard-count">{index + 1} / {deck.length}</span>
              <button className="btn btn-clear" onClick={() => goTo(index + 1)}>Next &rsaquo;</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
