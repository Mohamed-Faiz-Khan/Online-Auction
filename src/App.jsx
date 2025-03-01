import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import PostAuction from './components/PostAuction';
import AuctionItem from './components/AuctionItem';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}
        
        <div className="content">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
            <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/home" />} />
            <Route path="/signin" element={!isAuthenticated ? <Signin setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/post-auction" element={isAuthenticated ? <PostAuction /> : <Navigate to="/signin" />} />
            <Route path="/auction/:id" element={isAuthenticated ? <AuctionItem /> : <Navigate to="/signin" />} />
          </Routes>
        </div>
        
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;
