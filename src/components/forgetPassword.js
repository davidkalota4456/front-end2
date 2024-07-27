import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/forgetPassword', { email });
      setMessage(response.data.message);
      if(response.status === 201) {
        navigate('/tempPassword'); // Redirect to the new password page
      }
      
    } catch (error) {
      console.error('Error sending request:', error);
      setMessage('Failed to send password reset email.');
    }
  };

  return (
    <div className="forget-password">
      <h2>Forget Password</h2>
      <form onSubmit={handleEmailSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgetPassword;
