import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    alert(`Signup successful for ${username}`);
  };

  return (
    <div className="auth-container">
      <h2>Signin</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signin</button>
      </form>
      <p>Already have an account? <Link to="/signin">Signup</Link></p>
    </div>
  );
}

export default Signin;
