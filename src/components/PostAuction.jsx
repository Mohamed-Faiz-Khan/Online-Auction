import React, { useState } from 'react';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [auctionStart, setAuctionStart] = useState('');
  const [startingBid, setStartingBid] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    alert(`Auction for ${itemName} posted!`);
  };

  return (
    <div className="post-auction">
      <h2>Post an Auction</h2>
      <form onSubmit={handlePost}>
        <input 
          type="text" 
          placeholder="Item Name" 
          onChange={(e) => setItemName(e.target.value)} 
          required 
        />

        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setPhoto(e.target.files[0])} 
          required 
        />

        <input 
          type="datetime-local" 
          onChange={(e) => setAuctionStart(e.target.value)} 
          required 
        />

        <input 
          type="number" 
          placeholder="Starting Bid (IND)" 
          onChange={(e) => setStartingBid(e.target.value)} 
          required 
        />

        <button type="submit">Post Auction</button>
      </form>
    </div>
  );
}

export default PostAuction;
