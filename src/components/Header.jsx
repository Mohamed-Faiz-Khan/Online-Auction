import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header({ setIsAuthenticated }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1><Link to="/home">AuctionMaster</Link></h1>
      </div>
      <nav>
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/post-auction">Post Auction</Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;
