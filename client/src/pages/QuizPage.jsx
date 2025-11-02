import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';

function QuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedQuiz = sessionStorage.getItem('currentQuiz');
    if (savedQuiz) {
      try {
        setQuiz(JSON.parse(savedQuiz));
      } catch (error) {
        console.error('Error parsing quiz:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (userAnswer && userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);
  };

  if (!quiz) {
    return <div className="quiz-page">Loading quiz...</div>;
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <h1>Quiz</h1>
        
        {quiz.questions.map((question, index) => (
          <div key={index} className="question-card">
            <div className="question-header">
              <span className="question-number">Question {index + 1}</span>
              <span className="question-type">{question.type === 'multiple-choice' ? 'Multiple Choice' : 'Short Answer'}</span>
            </div>
            <h3 className="question-text">{question.question}</h3>

            {question.type === 'multiple-choice' && question.options ? (
              <div className="options">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      disabled={showResults}
                    />
                    <span className={showResults && option === question.correctAnswer ? 'correct-answer' : ''}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="short-answer-input"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                disabled={showResults}
                placeholder="Type your answer here..."
                rows={3}
              />
            )}

            {showResults && (
              <div className="answer-feedback">
                <div className={`feedback ${answers[index]?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() ? 'correct' : 'incorrect'}`}>
                  {answers[index]?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() 
                    ? '✓ Correct!' 
                    : `✗ Incorrect. Correct answer: ${question.correctAnswer}`}
                </div>
                {question.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="quiz-actions">
          {!showResults ? (
            <button onClick={handleSubmit} className="submit-btn">
              Submit Quiz
            </button>
          ) : (
            <div className="results">
              <div className="score-display">
                <h2>Your Score: {score} / {quiz.questions.length}</h2>
                <p className="score-percentage">
                  {Math.round((score / quiz.questions.length) * 100)}%
                </p>
              </div>
              <button onClick={() => navigate('/')} className="back-btn">
                Create New Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;

