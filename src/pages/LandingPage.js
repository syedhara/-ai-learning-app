import { Link } from 'react-router-dom';
import { getProfileName, getStats } from '../utils/progress';

// ── Landing page ─────────────────────────────────────────────────────────────
// The hub of the app. For now it only links to the Crossword puzzle, but
// this is where more features (like Practice by Topic) will get their own
// links as they're built, instead of everything living on one page.
export default function LandingPage() {
  const name = getProfileName();
  const isReturning = getStats().totalAttempted > 0;

  return (
    <div className="page-container">
      <h1 className="puzzle-title">Learn AI, One Puzzle at a Time</h1>
      {name && <p className="landing-greeting">{isReturning ? 'Welcome back' : 'Welcome'}, {name}!</p>}
      <p className="puzzle-tagline">Big plans, one (1) feature so far — go on, click the crossword before I change my mind.</p>
      <Link to="/puzzle" className="btn btn-primary">
        Crossword Puzzle
      </Link>
    </div>
  );
}
