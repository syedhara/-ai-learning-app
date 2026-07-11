import { useNavigate } from 'react-router-dom';

// ── Login page (stub) ───────────────────────────────────────────────────────
// There's no real account system yet — this page just stands in the spot
// where sign-in will eventually go, so the rest of the app can be built
// around the Login → Landing → Puzzle flow from day one.
// Clicking Continue just moves on to the Landing page.
export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="puzzle-title">Learn AI · Crossword</h1>
      <p className="puzzle-tagline">Login screen coming soon™ — for now, just smash the button below.</p>
      <button className="btn btn-primary" onClick={() => navigate('/home')}>
        Continue
      </button>
    </div>
  );
}
