const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// ── Word filter bar ──────────────────────────────────────────────────────────
// Shared difficulty + subject dropdowns, used by both the Glossary section
// (Review Vocabulary page) and the Flashcards page to narrow down which
// words from the full word bank are shown.
export default function WordFilterBar({ difficulty, onDifficultyChange, subject, onSubjectChange, subjects }) {
  return (
    <div className="filter-bar">
      <label className="filter-field">
        <span className="filter-label">Difficulty</span>
        <select value={difficulty} onChange={e => onDifficultyChange(e.target.value)}>
          <option value="all">All levels</option>
          {Object.keys(DIFFICULTY_LABELS).map(level => (
            <option key={level} value={level}>{DIFFICULTY_LABELS[level]}</option>
          ))}
        </select>
      </label>
      <label className="filter-field">
        <span className="filter-label">Subject</span>
        <select value={subject} onChange={e => onSubjectChange(e.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
    </div>
  );
}
