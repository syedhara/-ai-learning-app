import { formatWord, formatBlanks } from '../utils/wordFormat';

// ── Flashcard ────────────────────────────────────────────────────────────────
// A single flippable card: subject tag + clue on top, with the word hidden
// behind underscores until the user taps/clicks (or presses Enter/Space) to
// reveal it. Shared by the pre-puzzle word review and the standalone
// Flashcards study page so both look and behave identically.
export default function Flashcard({ word, revealed, onToggle }) {
  return (
    <div
      className="flashcard"
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
    >
      <span className="flashcard-subject">{word.subject}</span>
      <p className="flashcard-clue">{word.clue}</p>
      <div className={`flashcard-answer${revealed ? ' flashcard-answer-revealed' : ''}`}>
        {revealed ? formatWord(word.word, word.breakAfter) : formatBlanks(word.word, word.breakAfter)}
      </div>
      <span className="flashcard-tap-hint">{revealed ? 'Tap to hide' : 'Tap to reveal'}</span>
    </div>
  );
}
