import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadSection from '../components/UploadSection';
import SummarySection from '../components/SummarySection';
import QuizSection from '../components/QuizSection';
import './Home.css';

function Home() {
  const [extractedText, setExtractedText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const navigate = useNavigate();

  const handleTextExtracted = (text, name) => {
    setExtractedText(text);
    setSourceName(name);
  };

  const handleViewQuiz = (quiz) => {
    sessionStorage.setItem('currentQuiz', JSON.stringify(quiz));
    navigate('/quiz');
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Welcome to Smart Study AI</h1>
        <p>Your intelligent study assistant for better learning</p>
      </div>

      <UploadSection onTextExtracted={handleTextExtracted} />

      {extractedText && (
        <>
          <div className="source-info">
            <p>Source: <strong>{sourceName}</strong></p>
          </div>
          <SummarySection text={extractedText} />
          <QuizSection text={extractedText} onViewQuiz={handleViewQuiz} />
        </>
      )}
    </div>
  );
}

export default Home;

