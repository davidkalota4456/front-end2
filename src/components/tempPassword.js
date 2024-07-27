import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiUrl from '../utils/apiConfig';

function ResetPassword() {
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/cnfirmTempPassword`, {
        temporaryPassword
      });
      setMessage(response.data.message);

      if(response.status === 201) {
        navigate('/newPassword'); // Redirect to the new password page
      }
      
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password.');
    }
  };

  return (
    <div className="reset-password">
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordResetSubmit}>
        <div>
          <label htmlFor="temporaryPassword">Temporary Password:</label>
          <input
            type="text"
            id="temporaryPassword"
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
