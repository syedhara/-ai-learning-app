import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allWords, subjects } from '../data/puzzleData';
import { formatWord } from '../utils/wordFormat';
import WordFilterBar from '../components/WordFilterBar';

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// ── Review Vocabulary ────────────────────────────────────────────────────────
// A study hub for browsing the whole word bank (not just one puzzle's worth):
// a filterable glossary of every word + definition, plus a link out to the
// dedicated Flashcards page for self-testing one word at a time.
export default function ReviewVocabularyPage() {
  const [difficulty, setDifficulty] = useState('all');
  const [subject, setSubject]       = useState('all');

  const filtered = useMemo(() => allWords.filter(w =>
    (difficulty === 'all' || w.difficulty === difficulty) &&
    (subject === 'all' || w.subject === subject)
  ), [difficulty, subject]);

  return (
    <div className="review-container">
      <h1 className="puzzle-title">Review Vocabulary</h1>
      <p className="puzzle-tagline">Browse every AI term and definition before you play.</p>

      <div className="review-nav-links">
        <Link to="/home" className="link-btn">&larr; Back to Home</Link>
        <Link to="/puzzle" className="link-btn">Crossword Puzzle &rarr;</Link>
      </div>

      <section className="review-section">
        <h2 className="review-section-title">Glossary</h2>
        <WordFilterBar
          difficulty={difficulty} onDifficultyChange={setDifficulty}
          subject={subject} onSubjectChange={setSubject}
          subjects={subjects}
        />
        <p className="glossary-count">{filtered.length} word{filtered.length === 1 ? '' : 's'}</p>
        <div className="glossary-list">
          {filtered.map(w => (
            <div className="glossary-row" key={w.word}>
              <div className="glossary-word-col">
                <span className="glossary-word">{formatWord(w.word, w.breakAfter)}</span>
                <span className={`difficulty-tag difficulty-${w.difficulty}`}>{DIFFICULTY_LABELS[w.difficulty]}</span>
              </div>
              <p className="glossary-clue">{w.clue}</p>
              <span className="glossary-subject-tag">{w.subject}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="review-section review-flashcard-cta">
        <h2 className="review-section-title">Flashcards</h2>
        <p className="review-intro">Prefer testing yourself one word at a time? Flip through flashcards instead.</p>
        <Link to="/review/flashcards" className="btn btn-primary">Go to Flashcards</Link>
      </section>
    </div>
  );
}
