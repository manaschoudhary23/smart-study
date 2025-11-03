import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import './QuizSection.css';

function QuizSection({ text, onViewQuiz }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('mixed');

  const API_BASE_URL = 'https://smart-study-2.onrender.com';

  const generateQuiz = async () => {
    if (!text) {
      setError('Please upload or paste text first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/quiz/generate`, 
        { text, numQuestions, questionType }
      );

      if (response.data.success) {
        onViewQuiz(response.data.quiz);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  if (!text) return null;

  return (
    <div className="quiz-section">
      <h2>Generate Quiz</h2>
      <div className="quiz-options">
        <div className="option-group">
          <label htmlFor="num-questions">Number of Questions:</label>
          <input
            id="num-questions"
            type="number"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            disabled={loading}
          />
        </div>

        <div className="option-group">
          <label htmlFor="question-type">Question Type:</label>
          <select
            id="question-type"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            disabled={loading}
          >
            <option value="mixed">Mixed (Multiple Choice & Short Answer)</option>
            <option value="multiple-choice">Multiple Choice Only</option>
            <option value="short-answer">Short Answer Only</option>
          </select>
        </div>
      </div>

      <button onClick={generateQuiz} disabled={loading} className="generate-btn">
        Generate Quiz
      </button>

      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default QuizSection;
