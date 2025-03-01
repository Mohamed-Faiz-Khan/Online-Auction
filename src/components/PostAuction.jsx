import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PostAuction.css';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [auctionStart, setAuctionStart] = useState('');
  const [auctionEnd, setAuctionEnd] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be signed in to post an auction.');
      return;
    }

    const auctionData = { itemName, startingBid, auctionStart, auctionEnd, image };

    try {
      await axios.post('http://localhost:5001/auction', auctionData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setMessage('Auction posted successfully!');
      setItemName('');
      setStartingBid('');
      setAuctionStart('');
      setAuctionEnd('');
      setImage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to post auction');
    }
  };

  return (
    <div className="post-auction">
      <h2 className="post-title">Post a New Auction</h2>  {/* ✅ Title stays at the top */}
      {message && <p className="message">{message}</p>}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          <input type="number" placeholder="Starting Bid ($)" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} required />
          <input type="datetime-local" placeholder="Auction Start Time" value={auctionStart} onChange={(e) => setAuctionStart(e.target.value)} required />
          <input type="datetime-local" placeholder="Auction End Time" value={auctionEnd} onChange={(e) => setAuctionEnd(e.target.value)} required />
          <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
          <button type="submit">Post Auction</button>
        </form>
      </div>
    </div>
  );
}

export default PostAuction;
