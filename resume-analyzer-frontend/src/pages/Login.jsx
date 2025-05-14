import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(''); // Changed from username to email to match backend
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Configure axios with proper headers
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email, // Send email instead of username to match backend expectation
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Check if token exists in response
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set up axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        navigate('/dashboard');
      } else {
        setError('Invalid response from server. Token not received.');
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response?.data || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label> {/* Changed label from Username to Email */}
          <input
            type="email" // Changed to email type for better validation
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;