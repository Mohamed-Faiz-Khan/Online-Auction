import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PostAuction.css';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [auctionStart, setAuctionStart] = useState('');
  const [auctionEnd, setAuctionEnd] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be signed in to post an auction.');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('startingBid', startingBid);
    formData.append('auctionStart', auctionStart);
    formData.append('auctionEnd', auctionEnd);
    formData.append('image', image); // ✅ Upload image file

    try {
      await axios.post('http://localhost:5001/auction', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // ✅ Important for file upload
        },
      });

      setMessage('Auction posted successfully!');
      setItemName('');
      setStartingBid('');
      setAuctionStart('');
      setAuctionEnd('');
      setImage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to post auction');
    }
  };

  return (
    <div className="post-auction">
      <h2 className="post-title">Post a New Auction</h2>
      {message && <p className="message">{message}</p>}
      <div className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          <input type="number" placeholder="Starting Bid ($)" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} required />

          <label>Auction Start Time:</label>
          <input type="datetime-local" value={auctionStart} onChange={(e) => setAuctionStart(e.target.value)} required />

          <label>Auction End Time:</label>
          <input type="datetime-local" value={auctionEnd} onChange={(e) => setAuctionEnd(e.target.value)} required />

          <label>Upload Item Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

          <button type="submit">Post Auction</button>
        </form>
      </div>
    </div>
  );
}

export default PostAuction;
