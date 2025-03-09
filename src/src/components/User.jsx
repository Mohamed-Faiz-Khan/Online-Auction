import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/User.css';

function User() {
    const [wonAuctions, setWonAuctions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5001/user/won-auctions', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setWonAuctions(response.data))
        .catch(() => console.log('Error fetching won auctions'));
    }, []);

    const handlePayment = async (id) => {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:5001/pay/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => alert('Payment Successful!'))
        .catch(() => alert('Payment Failed!'));
    };

    return (
        <div className="user-dashboard">
            <h2>Items You Won</h2>
            <div className="auction-list">
                {wonAuctions.map((auction) => (
                    <div key={auction._id} className="auction-card">
                        <img src={`http://localhost:5001${auction.imageUrl}`} alt={auction.itemName} />
                        <h3>{auction.itemName}</h3>
                        <p>Winning Bid: ${auction.currentBid}</p>
                        {auction.isPaid ? <p>Paid</p> : (
                            <button className="pay-button" onClick={() => handlePayment(auction._id)}>Pay Now</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default User;
