import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import './UploadSection.css';

function UploadSection({ onTextExtracted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setFilename(file.name);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onTextExtracted(response.data.text, file.name);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload PDF');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextPaste = (e) => {
    const text = e.target.value;
    if (text.trim()) {
      onTextExtracted(text, 'Pasted text');
    }
  };

  return (
    <div className="upload-section">
      <h2>📄 Upload Document or Paste Text</h2>
      <div className="upload-container">
        <div className="upload-box">
          <label htmlFor="pdf-upload" className="upload-label">
            <span className="upload-icon">📎</span>
            <span>Upload PDF</span>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={loading}
              style={{ display: 'none' }}
            />
          </label>
          {filename && !loading && (
            <p className="filename">✓ {filename}</p>
          )}
        </div>
        <div className="divider">OR</div>
        <div className="text-paste">
          <textarea
            placeholder="Or paste your text here..."
            onChange={handleTextPaste}
            disabled={loading}
            rows={5}
          />
        </div>
      </div>
      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default UploadSection;

