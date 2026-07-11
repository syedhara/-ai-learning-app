import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import PuzzlePage from './pages/PuzzlePage';

// App is the root of the application — it sets up the page flow:
// Login (stub for now) → Landing (hub) → Puzzle
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/puzzle" element={<PuzzlePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
