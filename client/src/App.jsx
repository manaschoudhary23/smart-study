import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import VisualQuestionPage from './pages/VisualQuestionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/visual-question" element={<VisualQuestionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

