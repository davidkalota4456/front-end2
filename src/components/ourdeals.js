import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import apiUrl from '../utils/apiConfig';


function OrderHistory() {
  const { username } = useContext(UserContext);
  const [orderHistory, setOrderHistory] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (username) {
      axios.get(`${apiUrl}/totalOrder/${username}`)
        .then((response) => {
          if (!response.data) {
            setErrorMessage('User has not placed any orders yet.');
          } else {
            setOrderHistory(response.data);
            setErrorMessage(''); // Clear any previous error messages
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setErrorMessage('User not found.');
          } else {
            console.error('Error fetching order history:', error);
            setErrorMessage('Failed to fetch order history.');
          }
        });
    }
  }, [username]);

  if (!username) {
    return <p>You need to log in or you haven't created an order yet.</p>;
  }

  return (
    <div>
      <h2>Order History for {username}</h2>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : orderHistory ? (
        <div>
          <p>Car Order: {orderHistory.carOrder ? 'Yes' : 'No'}</p>
          <p>Amount Car Order: {orderHistory.amountCarOrder}</p>
          <p>House Order: {orderHistory.HouseOrder ? 'Yes' : 'No'}</p>
          <p>Amount House Order: {orderHistory.amountHouseOrder}</p>
          <p>Total Cost: ${orderHistory.totalCost}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default OrderHistory;




















