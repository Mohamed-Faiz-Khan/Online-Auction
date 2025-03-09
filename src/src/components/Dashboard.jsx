import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5001/auctions')
      .then(response => {
        setAuctions(response.data.length ? response.data : []);
        if (response.data.length === 0) setMessage('There are no auction items yet.');
      })
      .catch(() => {
        setMessage('Failed to load auctions.');
      });
  }, []);

  // Countdown Timer Function
  const getRemainingTime = (endTime) => {
    const now = new Date().getTime();
    const auctionEndTime = new Date(endTime).getTime();
    const remainingTime = auctionEndTime - now;

    if (remainingTime <= 0) return "Auction Ended";

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Timer updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) => ({
          ...auction,
          remainingTime: getRemainingTime(auction.auctionEnd),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  return (
    <div className="dashboard">
      <h2>Available Auctions</h2>
      {message ? <p>{message}</p> : (
        <div className="auction-list">
          {auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              {/* ✅ Corrected Image URL Handling */}
              <img 
                src={`http://localhost:5001${auction.imageUrl.startsWith('/uploads') ? auction.imageUrl : '/uploads/' + auction.imageUrl}`} 
                alt={auction.itemName} 
              />
              <h3>{auction.itemName}</h3>
              <p>Starting Bid: ${auction.startingBid}</p>
              <p>Current Bid: ${auction.currentBid || auction.startingBid}</p>
              <p className="countdown">
                {auction.remainingTime || getRemainingTime(auction.auctionEnd)}
              </p>
              <button className="bid-button" 
                onClick={() => navigate(`/auction/${auction._id}`)}
                disabled={auction.remainingTime === "Auction Ended"}
              >
                {auction.remainingTime === "Auction Ended" ? "Auction Ended" : "Place a Bid"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
