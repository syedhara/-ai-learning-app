import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import PuzzlePage from './pages/PuzzlePage';
import ReviewVocabularyPage from './pages/ReviewVocabularyPage';
import FlashcardsPage from './pages/FlashcardsPage';

// App is the root of the application — it sets up the page flow:
// Login (stub for now) → Landing (hub) → Puzzle / Review Vocabulary
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
          <Route path="/review" element={<ReviewVocabularyPage />} />
          <Route path="/review/flashcards" element={<FlashcardsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
