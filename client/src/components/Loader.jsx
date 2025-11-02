import React from 'react';
import './Loader.css';

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loader-text">Processing...</p>
    </div>
  );
}

export default Loader;

