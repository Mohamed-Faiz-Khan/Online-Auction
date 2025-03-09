import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Signinup.css";

function Signin({ setIsAuthenticated }) {  // Accept setIsAuthenticated as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/signin', { username, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Signin successful');
      setIsAuthenticated(true);  // ✅ Update authentication state
      navigate('/home');  // Redirect to home
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signin failed');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSignin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <button onClick={() => navigate('/signup')}>Sign Up</button></p>
    </div>
  );
}

export default Signin;
