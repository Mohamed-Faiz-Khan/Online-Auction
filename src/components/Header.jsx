import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <h1>
        <Link to="/">AuctionMaster</Link>
      </h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/post-auction">Post Auction</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/signin">Signin</Link>
      </nav>
    </header>
  );
}

export default Header;
