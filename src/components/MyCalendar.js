import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/MyCalendar.css';
import axios from 'axios';
import apiUrl from '../utils/apiConfig';

function MyCalendar() {
  const [dates, setDates] = useState([null, null]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hotels, setHotels] = useState([]); // Initialize hotels state as an empty array
  const [cart, setCart] = useState([]); // State to store multiple orders
  const dropdownRef = useRef(null);

  
  const onChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      setDates(selectedDates);
    } else {
      setDates([selectedDates, null]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setIsOpen(false);
  };

  const totalCost = (totalDays, pricePerNight) => {
    return (totalDays * pricePerNight).toFixed(2);
  };

  const addToCart = () => {
    const currentDate = new Date();
    const [start, end] = dates;

    if (!start || !end) {
      console.log('Start date and end date must be selected.');
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    console.log('Current Date:', currentDate);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const daysBetween = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = totalCost(daysBetween, selectedHotel.pricePerNight);

    if (endDate > currentDate) {
      if (selectedHotel.availableRooms > 0) {
        const orderData = {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
          totalCost: totalPrice.toString(),
          totalDays: daysBetween,
          hotelName: selectedHotel.hotelName
        };

        setCart([...cart, orderData]);

        console.log('Order added to cart:', orderData);
        setDates([null, null]);
        setSelectedHotel(null);
      } else {
        console.log('No rooms available.');
      }
    } else {
      console.log('End date must be after the current date.');
    }
  };

  const submitOrders = () => {
    axios.post(`${apiUrl}/rentHouse`, { cart })
      .then(response => {
        console.log('Orders successfully sent to backend:', response.data);
       
      })
      .catch(error => {
        console.error('Error sending orders to backend:', error);
      });
  };

  const renderSelectedRange = () => {
    if (!dates[0] || !dates[1]) return null;

    const [start, end] = dates;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysBetween = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    return (
      <div className='myOrder'>
        <p>Start Date: {startDate.toDateString()}</p>
        <p>End Date: {endDate.toDateString()}</p>
        <p>Number of Days: {daysBetween}</p>
        {selectedHotel && (
          <div>
            <p>Selected Hotel: {selectedHotel.hotelName}</p>
            <p>Location: {selectedHotel.location}</p>
            <p>Price per Night: ${selectedHotel.pricePerNight}</p>
            <p>Total Price: ${totalCost(daysBetween, selectedHotel.pricePerNight)}</p>
            <button
              className="order-button2"
              onClick={addToCart}
            >
              Add To Cart
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    axios.get(`${apiUrl}/houses`) 
      .then(response => {
        setHotels(response.data); // Set the hotels state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  }, []);

  return (
    <div className="container" >
      <h2 className="containerh3">Houses Rental</h2>
      
      <Calendar className="calendar-container" selectRange={true} onChange={onChange} value={dates} />
      

      {renderSelectedRange()}
      <div className="dropdown" ref={dropdownRef}>
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Select a Hotel
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            {hotels.map((hotel, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => handleHotelSelect(hotel)}
              >
                {hotel.hotelName}
              </button>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="cart">
          <h2>Cart</h2>
          <ul>
            {cart.map((order, index) => (
              <li key={index}>
                <p>{order.hotelName}</p>
                <p>{order.start} to {order.end}</p>
                <p>Total Cost: ${order.totalCost}</p>
                <p>---------------------------------</p>
              </li>
            ))}
          </ul>
          <button className="order-button"
           onClick={submitOrders}
           >
            Submit Orders
            </button>
        </div>
      )}
    </div>
  );
}

export default MyCalendar;
