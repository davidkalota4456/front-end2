import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/rentCar.css';
import axios from 'axios';
import CarImageSlider from './CarImageSlider';
import apiUrl from '../utils/apiConfig';

function ConstructorComponent({ cars }) {
  const [dates, setDates] = useState([null, null]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [images, setImages] = useState([]);

  const [alertMessage, setAlertMessage] = useState('');

  const [bookedDates, setBookedDates] = useState([]);
  const dropdownRef = useRef(null);

  const onChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      setDates(selectedDates);
    } else {
      setDates([selectedDates, null]);
    }
  };

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(`${apiUrl}/booking`);
        setBookedDates(response.data);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDates();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside of the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Only close if the click is not on the scrollbar area
        if (event.clientX < window.innerWidth - 15) {
          setIsOpen(false);
        }
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

  const handleCarSelect = async (car) => {
    setSelectedCar(car);
    setIsOpen(false);
    try {
      const response = await axios.get(`${apiUrl}/image/${car.name}`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching car images:', error);
      setImages([]); // Clear images if there's an error
    }


  };

  const totalCost = (totalDays, pricePerDay) => {
    return (totalDays * pricePerDay).toFixed(2);
  };

  const isDateRangeAvailable = (startDate, endDate) => {
    if (!selectedCar) return true;

    const carBookedDates = bookedDates.find(entry => entry.carName === selectedCar.name);
    if (!carBookedDates) return true;

    for (const booking of carBookedDates.bookings) {
      const bookedStart = new Date(booking.startDate);
      const bookedEnd = new Date(booking.endDate);

      if ((startDate >= bookedStart && startDate <= bookedEnd) || (endDate >= bookedStart && endDate <= bookedEnd) || (startDate <= bookedStart && endDate >= bookedEnd)) {
        return false;
      }
    }
    return true;
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

    if (!isDateRangeAvailable(startDate, endDate)) {
      setAlertMessage('Selected dates overlap with booked dates. Please select different dates.');
      console.log('Selected dates overlap with booked dates. Please select different dates.');
      return;
    }

    console.log('Current Date:', currentDate);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    const daysBetween = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = totalCost(daysBetween, selectedCar.pricePerDay);

    if (endDate > currentDate) {
      const orderData = {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        totalCost: totalPrice.toString(),
        totalDays: daysBetween,
        carName: selectedCar.name,
      };

      setCart([...cart, orderData]);

      console.log('Order added to cart:', orderData);
      setDates([null, null]);
      setSelectedCar(null);
      setAlertMessage('');
    } else {
      console.log('End date must be after the current date.');
    }
  };

  const submitOrders = () => {
    axios.post(`${apiUrl}/orderCar`, { cart })
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
    const daysBetween = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

    return (
      <div>
        <p>Start Date: {startDate.toDateString()}</p>
        <p>End Date: {endDate.toDateString()}</p>
        <p>Number of Days: {daysBetween}</p>
        {selectedCar && (
          <div>
            <p>Selected Car: {selectedCar.name}</p>
            <p>Price per Day: ${selectedCar.pricePerDay}</p>
            <p>Total Price: ${totalCost(daysBetween, selectedCar.pricePerDay)}</p>
            <button className="order-button2" onClick={addToCart}>
              Add To Cart
            </button>
          </div>
        )}

        {images.length > 0 && (
        <div className="car-images">
          <CarImageSlider imagePaths={images} />
        </div>
      )}
  
      </div>
    );
  };
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Check if a car is selected
      if (selectedCar) {
        const carBookedDates = bookedDates.find(entry => entry.carName === selectedCar.name);
  
        if (carBookedDates) {
          // Check if the current date falls within any booking range
          for (const booking of carBookedDates.bookings) {
            const bookedStart = new Date(booking.startDate);
            const bookedEnd = new Date(booking.endDate);
  
            if (date >= bookedStart && date <= bookedEnd) {
              return 'booked-day'; 
            }
          }
        }
      }
    }
    return null; // No class for unbooked days
  };
  

  return (
    <div className="container">
      <h2 className="containerh2">Car Rental</h2>
      <Calendar selectRange={true} onChange={onChange} value={dates} tileClassName={tileClassName} />

      {alertMessage && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}

      {renderSelectedRange()}
      <div className="dropdown" ref={dropdownRef}>
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          Select a Car
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            {cars.map((car, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => handleCarSelect(car)}
              >
                {car.name} ({car.year})
              </button>
            ))}
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className="cart-container">
          <h2>Cart</h2>
          <ul className="cart-list">
            {cart.map((order, index) => (
              <li key={index}>
                <p>{order.carName}</p>
                <p>{order.start} to {order.end}</p>
                <p>Total Cost: ${order.totalCost}</p>
                <p>---------------------------------</p>
              </li>
            ))}
          </ul>
          <button onClick={submitOrders}>Submit Orders</button>
        </div>
      )}
    </div>
  );
}

export default ConstructorComponent;























