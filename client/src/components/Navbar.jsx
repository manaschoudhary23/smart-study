import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Smart Study AI
        </Link>
        <div className="navbar-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
          <Link 
            to="/quiz" 
            className={location.pathname === '/quiz' ? 'active' : ''}
          >
            Quiz
          </Link>
          <Link 
            to="/visual-question" 
            className={location.pathname === '/visual-question' ? 'active' : ''}
          >
            Visual Q&A
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

