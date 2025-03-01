import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ Import useNavigate
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // ✅ Initialize navigation

  useEffect(() => {
    axios.get('http://localhost:5001/auctions')
      .then(response => {
        setAuctions(response.data.length ? response.data : []);
        if (response.data.length === 0) setMessage('There are no auction items yet.');
      })
      .catch(error => {
        setMessage('Failed to load auctions.');
      });
  }, []);

  return (
    <div className="dashboard">
      <h2>Available Auctions</h2>
      {message ? <p>{message}</p> : (
        <div className="auction-list">
          {auctions.map((auction) => (
            <div key={auction._id} className="auction-card">
              <img src={auction.image} alt={auction.itemName} />
              <h3>{auction.itemName}</h3>
              <p>Starting Bid: ${auction.startingBid}</p>
              <p>Current Bid: ${auction.currentBid || auction.startingBid}</p>
              <p>Auction Ends: {new Date(auction.auctionEnd).toLocaleString()}</p>
              {/* ✅ Navigate to AuctionItem page with auction ID */}
              <button className="bid-button" onClick={() => navigate(`/auction/${auction._id}`)}>Place a Bid</button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
