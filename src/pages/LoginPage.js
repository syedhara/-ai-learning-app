import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileName, setProfileName, getStats } from '../utils/progress';

// ── Login page ───────────────────────────────────────────────────────────────
// Still no real accounts — just a name (no password) so returning players get
// a personal greeting and their stats. Everything lives in localStorage on
// this device; see src/utils/progress.js.
export default function LoginPage() {
  const navigate = useNavigate();
  const [savedName] = useState(() => getProfileName());
  const [editingName, setEditingName] = useState(!savedName);
  const [name, setName] = useState(savedName);
  const stats = getStats();
  const hasStats = stats.totalAttempted > 0;

  function handleContinue(e) {
    e.preventDefault();
    setProfileName(name.trim());
    navigate('/home');
  }

  return (
    <div className="page-container">
      <h1 className="puzzle-title">Learn AI · Crossword</h1>

      <form className="login-form" onSubmit={handleContinue}>
        {editingName ? (
          <>
            <p className="puzzle-tagline">No passwords here — just tell us who's playing.</p>
            <input
              className="login-name-input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </>
        ) : (
          <>
            <p className="puzzle-tagline">Welcome back, {savedName}!</p>
            {hasStats && (
              <div className="stats-card">
                <p className="stats-summary">
                  Attempted {stats.totalAttempted} · {stats.totalCorrect} correct ({stats.totalPct}%)
                </p>
                <ul className="stats-subjects">
                  {stats.bySubject.map(s => (
                    <li key={s.subject} className="stats-subject-row">
                      <span className="stats-subject-name">{s.subject}</span>
                      <span className="stats-subject-pct">{s.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button type="button" className="link-btn" onClick={() => setEditingName(true)}>
              Not you?
            </button>
          </>
        )}

        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </div>
  );
}
