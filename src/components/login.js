import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';
import apiUrl from '../utils/apiConfig';

function LoginForm() {
  const { setLocalUsername } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      userName: username,
      password: password,
      gmail: email
    };

    axios.post(`${apiUrl}/users`, userData)
      .then((response) => {
        console.log('Data sent to the backend:', response.data);
        // Clear input fields after successful submission
        setLocalUsername(username);
        setUsername('');
        setPassword('');
        setEmail('');
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Login</button>
      </form>

      <Link to="/forgetPassword">Forget password?</Link> {/* Navigate to /forget-password route */}
    </div>
  );
}

export default LoginForm;
