import Crossword from '../components/Crossword';

// Thin wrapper so the puzzle has its own route — Crossword itself is unchanged.
export default function PuzzlePage() {
  return <Crossword />;
}
