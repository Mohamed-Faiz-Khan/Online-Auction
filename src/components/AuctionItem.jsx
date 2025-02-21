import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function AuctionItem() {
  const { name } = useParams();
  const [bid, setBid] = useState(0);
  const [message, setMessage] = useState('');

  const handleBid = () => {
    if (bid <= 100) {
      setMessage('Bid must be higher than $100.');
      return;
    }
    setMessage('Bid placed successfully!');
  };

  return (
    <div>
      
      <main className="content">
        <h2>Auction Item : {name}</h2>
        <p>Current Bid: $100</p>
        <input type="number" value={bid} onChange={(e) => setBid(e.target.value)} placeholder="Enter your bid" />
        <button onClick={handleBid}>Place Bid</button>
        {message && <p>{message}</p>}
      </main>
      
    </div>
  );
}

export default AuctionItem;
