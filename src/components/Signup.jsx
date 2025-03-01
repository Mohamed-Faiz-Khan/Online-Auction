import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Signin_up.css";

function Signup() {  // ✅ Remove setIsAuthenticated as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5001/signup', { username, password });
      setMessage('Signup successful! Please sign in.');
      setTimeout(() => navigate('/signin'), 2000);  // Redirect after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <button onClick={() => navigate('/signin')}>Sign In</button></p>
    </div>
  );
}

export default Signup;
