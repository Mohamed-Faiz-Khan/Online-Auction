import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuctionItem.css';

function AuctionItem() {
  const { id } = useParams();  // ✅ Get auction ID from URL
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5001/auctions/${id}`)
      .then(response => setAuction(response.data))
      .catch(() => setMessage('Auction not found.'));
  }, [id]);

  const placeBid = async () => {
    const token = localStorage.getItem('token'); // ✅ Get authentication token
    if (!token) {
      setMessage('You must be logged in to place a bid.');
      return;
    }

    if (!bidAmount || isNaN(bidAmount) || bidAmount <= auction.currentBid) {
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
      setTimeout(() => navigate('/dashboard'), 2000); // ✅ Redirect after success
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to place bid.');
    }
  };

  if (!auction) return <p>{message || 'Loading auction details...'}</p>;

  return (
    <div className="auction-item">
      <h2>{auction.itemName}</h2>
      <img src={auction.image} alt={auction.itemName} />
      <p>Starting Bid: ${auction.startingBid}</p>
      <p>Current Bid: ${auction.currentBid || auction.startingBid}</p>
      <p>Auction Ends: {new Date(auction.auctionEnd).toLocaleString()}</p>
      <input
        type="number"
        placeholder="Enter your bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button onClick={placeBid}>Place a Bid</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AuctionItem;
