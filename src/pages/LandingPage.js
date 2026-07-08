import { Link } from 'react-router-dom';

// ── Landing page ─────────────────────────────────────────────────────────────
// The hub of the app. For now it only links to the Crossword puzzle, but
// this is where more features (like Practice by Topic) will get their own
// links as they're built, instead of everything living on one page.
export default function LandingPage() {
  return (
    <div className="page-container">
      <h1 className="puzzle-title">Learn AI</h1>
      <p className="puzzle-tagline">Pick something to practice</p>
      <Link to="/puzzle" className="btn btn-primary">
        Crossword Puzzle
      </Link>
    </div>
  );
}
