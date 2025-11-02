import React, { useState } from 'react';
import axios from 'axios';
import DrawSection from '../components/DrawSection';
import Loader from '../components/Loader';
import './VisualQuestionPage.css';

function VisualQuestionPage() {
  const [imageFile, setImageFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageReady = (blob, suggestedPrompt) => {
    setImageFile(blob);
    if (suggestedPrompt) {
      setQuestion(suggestedPrompt);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const analyzeImage = async () => {
    if (!imageFile) {
      setError('Please draw or upload an image first');
      return;
    }

    console.log('Starting image analysis...');
    console.log('Image type:', imageFile.type);
    console.log('Image size:', imageFile.size, 'bytes');

    setLoading(true);
    setError('');
    setAnalysis('');

    const formData = new FormData();
    formData.append('image', imageFile);
    if (question) formData.append('question', question);
    if (context) formData.append('context', context);

    try {
      console.log('Sending request to server...');
      const response = await axios.post('/api/vision/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      console.log('Received response:', response.data);

      if (response.data && response.data.success) {
        setAnalysis(response.data.analysis);
        console.log('Analysis set successfully');
      } else {
        const msg = response.data?.error || 'Unknown error from server';
        throw new Error(msg);
      }
    } catch (err) {
      console.error('Analysis error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      let fullError = err.response?.data?.error || 'Failed to analyze image';
      if (err.response?.data?.details) {
        fullError += '\n\n' + err.response.data.details;
      }
      if (err.response?.status === 413) {
        fullError = 'Image file is too large. Please use an image smaller than 4MB.';
      } else if (err.code === 'ECONNABORTED') {
        fullError = 'The request timed out. Please try again with a smaller image or better connection.';
      }
      setError(fullError);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImageFile(null);
    setQuestion('');
    setContext('');
    setAnalysis('');
    setError('');
  };

  return (
    <div className="visual-question-page">
      <div className="visual-header">
        <h1>Visual Question & Answer</h1>
        <p>Upload or draw an image, ask a question, and get AI-powered analysis</p>
      </div>

      <DrawSection onImageReady={handleImageReady} />

      {imageFile && (
        <div className="image-preview-section">
          <h3>Selected Image</h3>
          <div className="image-preview">
            {imageFile instanceof File ? (
              <img src={URL.createObjectURL(imageFile)} alt="Uploaded" />
            ) : (
              <img src={URL.createObjectURL(imageFile)} alt="Drawn" />
            )}
          </div>
        </div>
      )}

      <div className="alternative-upload">
        <label htmlFor="file-upload" className="upload-button">
          Or Upload Image File
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="question-section">
        <h2>Ask Your Question</h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., 'Find the distance', 'Explain this circuit', 'Which forces are acting here?', or leave blank for general analysis"
          rows={3}
          className="question-input"
        />
      </div>

      <div className="context-section">
        <h3> Additional Context (Optional)</h3>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Provide any additional context that might help with the analysis (e.g., related formulas, concepts, etc.)"
          rows={2}
          className="context-input"
        />
      </div>

      <div className="action-section">
        <button
          onClick={analyzeImage}
          disabled={loading || !imageFile}
          className="analyze-btn"
        >
          Analyze Image
        </button>
        <button
          onClick={resetAll}
          disabled={loading}
          className="reset-btn"
        >
          Reset
        </button>
      </div>

      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}

      {analysis && (
        <div className="analysis-section">
          <h2>Analysis Result</h2>
          <div className="analysis-content">
            <div className="markdown-content" dangerouslySetInnerHTML={{
              __html: analysis.split('\n').map(line => {
                if (line.trim().startsWith('#')) {
                  const level = line.match(/^#+/)[0].length;
                  const tag = `h${Math.min(level + 2, 6)}`;
                  return `<${tag}>${line.replace(/^#+\s*/, '')}</${tag}>`;
                } else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                  return `<li>${line.replace(/^[-*]\s*/, '')}</li>`;
                } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                  return `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
                } else if (line.trim()) {
                  return `<p>${line}</p>`;
                }
                return '';
              }).join('')
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualQuestionPage;

