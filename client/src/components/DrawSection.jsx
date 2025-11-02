import React, { useRef, useState, useEffect } from 'react';
import './DrawSection.css';

function DrawSection({ onImageReady }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setContext(ctx);
    }
  }, []);

  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const pos = getEventPos(e);

    if (context) {
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing || !context) return;

    const pos = getEventPos(e);

    context.lineTo(pos.x, pos.y);
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  };

  const stopDrawing = (e) => {
    e?.preventDefault();
    if (context) {
      context.closePath();
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (context) {
      const canvas = canvasRef.current;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const [mode, setMode] = useState('general');
  const [customPrompt, setCustomPrompt] = useState('');

  const exportImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], 'drawing.png', { type: 'image/png' });

      let suggestedPrompt = '';
      if (mode === 'equation') {
        suggestedPrompt = 'Solve this handwritten equation step-by-step and show your work.';
      } else if (mode === 'describe') {
        suggestedPrompt = 'Describe this image in detail, identify objects, relationships, and any text or labels.';
      } else if (mode === 'custom') {
        suggestedPrompt = customPrompt || 'Please analyze this image.';
      } else {
        suggestedPrompt = 'Please analyze this image and provide a clear, structured description.';
      }

      if (typeof onImageReady === 'function') {
        onImageReady(file, suggestedPrompt);
      }
    }, 'image/png');
  };


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas && context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="draw-section">
      <h2>Draw or Upload Image</h2>
      <div className="draw-controls">
        <div className="control-group">
          <label htmlFor="mode-select">Mode:</label>
          <select id="mode-select" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="general">General Analysis</option>
            <option value="equation">Handwritten Equation (Solve)</option>
            <option value="describe">Image Description</option>
            <option value="custom">Custom Prompt</option>
          </select>
        </div>
        {mode === 'custom' && (
          <div className="control-group">
            <label htmlFor="custom-prompt">Custom Prompt:</label>
            <input id="custom-prompt" type="text" value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="Enter your prompt" />
          </div>
        )}
        <div className="control-group">
          <label htmlFor="color-picker">Color:</label>
          <input
            id="color-picker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="control-group">
          <label htmlFor="brush-size">Brush Size: {brushSize}px</label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
          />
        </div>
        <button onClick={clearCanvas} className="control-btn">
          Clear
        </button>
        <label htmlFor="image-upload" className="control-btn upload-btn">
          Upload Image
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
        <button onClick={exportImage} className="control-btn primary">
          Use This Image
        </button>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="drawing-canvas"
        />
      </div>
      <p className="canvas-hint">Draw your question or diagram above, then click "Use This Image" to analyze it</p>
    </div>
  );
}

export default DrawSection;

