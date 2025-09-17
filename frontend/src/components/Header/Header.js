import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ user, onLogout, onLoginClick }) => {
  const handleAuthClick = () => {
    if (user) {
      onLogout();
    } else {
      onLoginClick();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <FontAwesomeIcon icon={faGraduationCap} className="icon" />
        <Link to="/" className="brand-text">INVENT</Link>
      </div>
      <nav className="header-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/clients" className="nav-link">Clients</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>
        <button 
          className="auth-button"
          onClick={handleAuthClick}
        >
          <FontAwesomeIcon icon={faUser} className="auth-icon" />
          {user ? 'Logout' : 'Login'}
        </button>
      </nav>
    </header>
  );
};

export default Header;