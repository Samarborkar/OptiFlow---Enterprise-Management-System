import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const LandingNavbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>OptiFlow</h2>
      </div>
      <div className="navbar-right">
        <Link to="/login" className="navbar-link">Login</Link>
        <Link to="/signup" className="navbar-link">Sign Up</Link>
      </div>
    </nav>
  );
};

export default LandingNavbar;
