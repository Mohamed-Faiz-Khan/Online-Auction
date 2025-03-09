import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuctionItem.css';

function AuctionItem() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch auction details
    axios.get(`http://localhost:5001/auctions/${id}`)
      .then(response => {
        console.log("Auction Data:", response.data);  // ✅ Debugging log
        setAuction(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching auction:", error);
        setMessage('Auction not found.');
        setLoading(false);
      });
  }, [id]);

  const placeBid = async () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      setMessage('You must be logged in to place a bid.');
      return;
    }

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= auction.currentBid) {
      setMessage('Your bid must be higher than the current bid.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/bid/${id}`,
        { bid: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Bid placed successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error("Bid Error:", error);
      setMessage(error.response?.data?.message || 'Failed to place bid.');
    }
  };

  if (loading) return <p className="loading">Loading auction details...</p>;

  if (!auction) return <p className="error">{message || 'Auction not found.'}</p>;

  return (
    <div className="auction-item">
      <h2>{auction.itemName}</h2>
      <img src={`http://localhost:5001${auction.imageUrl}`} alt={auction.itemName} />
      <p>Starting Bid: ${auction.startingBid}</p>
      <p>Current Bid: ${auction.currentBid || auction.startingBid}</p>
      <p>Auction Ends: {new Date(auction.auctionEnd).toLocaleString()}</p>
      <div className="bid-container">
        <input
          type="number"
          placeholder="Enter your bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <button onClick={placeBid}>Place a Bid</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AuctionItem;
