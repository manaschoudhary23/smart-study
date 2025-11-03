import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import './SummarySection.css';

function SummarySection({ text }) {
  const [summary, setSummary] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const API_BASE_URL = 'https://smart-study-2.onrender.com';

  const generateSummary = async () => {
    if (!text) {
      setError('Please upload or paste text first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/pdf/summarize`, { text });
      if (response.data.success) {
        setSummary(response.data.summary);
        setActiveTab('summary');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const generateExplanation = async () => {
    if (!text) {
      setError('Please upload or paste text first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/pdf/explain`, { text });
      if (response.data.success) {
        setExplanation(response.data.explanation);
        setActiveTab('explanation');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate explanation');
    } finally {
      setLoading(false);
    }
  };

  if (!text) return null;

  return (
    <div className="summary-section">
      <h2>Text Analysis</h2>
      <div className="action-buttons">
        <button 
          onClick={generateSummary} 
          disabled={loading}
          className="action-btn primary"
        >
          Generate Summary
        </button>
        <button 
          onClick={generateExplanation} 
          disabled={loading}
          className="action-btn secondary"
        >
          Explain Concepts
        </button>
      </div>

      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}

      {(summary || explanation) && (
        <div className="results-tabs">
          {summary && (
            <button
              className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
          )}
          {explanation && (
            <button
              className={`tab ${activeTab === 'explanation' ? 'active' : ''}`}
              onClick={() => setActiveTab('explanation')}
            >
              Explanation
            </button>
          )}
        </div>
      )}

      {activeTab === 'summary' && summary && (
        <div className="result-content">
          <div className="markdown-content" dangerouslySetInnerHTML={{ 
            __html: summary.split('\n').map(line => {
              if (line.trim().startsWith('#')) return `<h3>${line.replace(/^#+\s*/, '')}</h3>`;
              if (line.trim().startsWith('-') || line.trim().startsWith('*')) return `<li>${line.replace(/^[-*]\s*/, '')}</li>`;
              if (line.trim()) return `<p>${line}</p>`;
              return '';
            }).join('')
          }} />
        </div>
      )}

      {activeTab === 'explanation' && explanation && (
        <div className="result-content">
          <div className="markdown-content" dangerouslySetInnerHTML={{ 
            __html: explanation.split('\n').map(line => {
              if (line.trim().startsWith('#')) return `<h3>${line.replace(/^#+\s*/, '')}</h3>`;
              if (line.trim().startsWith('-') || line.trim().startsWith('*')) return `<li>${line.replace(/^[-*]\s*/, '')}</li>`;
              if (line.trim()) return `<p>${line}</p>`;
              return '';
            }).join('')
          }} />
        </div>
      )}
    </div>
  );
}

export default SummarySection;
