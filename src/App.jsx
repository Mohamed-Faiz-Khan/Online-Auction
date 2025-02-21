import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import PostAuction from './components/PostAuction';
import AuctionItem from './components/AuctionItem';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'; 

function App() {
  return (
    <Router>
      <Header />
      <div className="content"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-auction" element={<PostAuction />} />
          <Route path="/auction/:name" element={<AuctionItem />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
