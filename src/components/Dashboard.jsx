import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const dummyAuctions = [
    {
      id: 1,
      name: 'Antique Vase',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-r7tP1e8M163RGlo-lDQSxw3fRqWYC694Sw&s',
      currentBid: 120,
    },
    {
      id: 2,
      name: 'Luxury Watch',
      image: 'https://media.istockphoto.com/id/471712723/photo/watch.jpg?s=612x612&w=0&k=20&c=iMEdtY6uP3iFURngL9qAzzMnWYSkPmHrxIlYIEfduvM=',
      currentBid: 500,
    },
    {
      id: 3,
      name: 'Rare Painting',
      image: 'https://5.imimg.com/data5/CR/NM/NY/SELLER-14007172/efs220-500x500.jpeg',
      currentBid: 1000,
    }
  ];

  return (
    <div className="dashboard">
      <h2>Live Auctions</h2>
      <div className="auction-list">
        {dummyAuctions.map((item) => (
          <div key={item.id} className="auction-card">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Current Bid: ${item.currentBid}</p>
            <Link to={`/auction/${item.name}`}>
              <button className="bid-button">Place a Bid</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
