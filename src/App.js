//import React, { useEffect, useState } from 'react';
//import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//import Home from './components/Home';
//import LoginForm from './components/login';
//import ConstructorComponent from './components/rentacar';
//import MyCalendar from './components/MyCalendar';
//import OrderHistory from './components/ourdeals';
//import axios from 'axios';
//import Register from './components/register';
//import { UserProvider } from './components/UserContext';
//import ForgetPassword from './components/forgetPassword';
//import ResetPassword from './components/tempPassword';
//import NewPassword from './components/newPassword';
//import apiUrl from './utils/apiConfig';
//import './App.css';
//
//
//import image1 from './assets/images/front1.jpg';
//import image2 from './assets/images/front2.jpg';
//import image3 from './assets/images/front3.jpg';
//import image4 from './assets/images/front4.jpg';
//import image5 from './assets/images/front5.jpg';
//
//
//
//
//
//axios.defaults.withCredentials = true;
//
//function App() {
//  const [cars, setCars] = useState([]);
//  const [showImages, setShowImages] = useState(true);
//
//
//  useEffect(() => {
//    const fetchCars = async () => {
//      try {
//        const response = await axios.get(`${apiUrl}/rentCar`);
//        if (response.status !== 200) {
//          throw new Error('Network response was not ok');
//        }
//        setCars(response.data); // Update state with fetched data
//      } catch (error) {
//        console.error('Error fetching cars:', error.message);
//      }
//    };
//
//    fetchCars();
//  }, []); // Empty dependency array ensures this effect runs only once
//
//  return (
//    <UserProvider>
//      <Router>
//        <div className="App">
//          <h1 className='myWord'>Welcome Here You Could Rent Cars And Hotels</h1>
//          <nav>
//            <ul style={{ listStyleType: 'none', padding: 0, marginLeft: '200px'}}>
//              <li style={{ display: 'inline-block', marginRight: '40px' }}>
//                <Link to="/">Home</Link>
//              </li>
//              <li style={{ display: 'inline-block', marginRight: '40px' }}>
//                <Link to="/login">Login</Link>
//              </li>
//              <li style={{ display: 'inline-block', marginRight: '40px' }}>
//                <Link to="/rentacar">Rent a Car</Link>
//              </li>
//              <li style={{ display: 'inline-block', marginRight: '40px' }}>
//                <Link to="/MyCalendar">Rent A House</Link>
//              </li>
//              <li style={{ display: 'inline-block', marginRight: '40px' }}>
//                <Link to="/ourdeals">Order History</Link>
//              </li>
//              <li style={{ display: 'inline-block' }}>
//                <Link to="/register">register</Link>
//              </li>
//            </ul>
//          </nav>
//
//
//          <section className="image-gallery">
//            <img src={image1} alt="Front View 1" />
//            <img src={image2} alt="Front View 2" />
//            <img src={image3} alt="Front View 3" />
//            <img src={image4} alt="Front View 4" />
//            <img src={image5} alt="Front View 5" />
//          </section>
//
//
//
//
//          <Routes>
//            <Route path="/" element={<Home />} />
//            <Route path="/login" element={<LoginForm />} />
//
//            <Route path="/forgetPassword" element={<ForgetPassword />} />
//
//            <Route path="/tempPassword" element={<ResetPassword />} />
//            <Route path="/newPassword" element={<NewPassword />} />
//
//
//
//            <Route path="/register" element={< Register />} />
//  
//            <Route path="/rentacar"
//              element={<ConstructorComponent cars={cars} />} // Pass fetched cars as props
//            ></Route>
//  
//            <Route path="/MyCalendar" element={<MyCalendar />} />
//  
//            <Route path="/ourdeals" element={<OrderHistory />} />
//            
//  
//          </Routes>
//        </div>
//      </Router>
//    </UserProvider>
//  );
//}
//
//export default App;


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/login';
import ConstructorComponent from './components/rentacar';
import MyCalendar from './components/MyCalendar';
import OrderHistory from './components/ourdeals';
import axios from 'axios';
import Register from './components/register';
import { UserProvider } from './components/UserContext';
import ForgetPassword from './components/forgetPassword';
import ResetPassword from './components/tempPassword';
import NewPassword from './components/newPassword';
import apiUrl from './utils/apiConfig';
import './App.css';
import image1 from './assets/images/front1.jpg';
import image2 from './assets/images/front2.jpg';
import image3 from './assets/images/front3.jpg';
import image4 from './assets/images/front4.jpg';
import image5 from './assets/images/front5.jpg';

axios.defaults.withCredentials = true;

function AppContent() {
  const [cars, setCars] = useState([]);
  const [showImages, setShowImages] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${apiUrl}/rentCar`);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setCars(response.data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching cars:', error.message);
      }
    };

    fetchCars();
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    // Hide images when not on the home page
    if (location.pathname !== '/') {
      setShowImages(false);
    } else {
      setShowImages(true);
    }
  }, [location.pathname]); // Depend on location.pathname to re-run the effect on route change

  return (
    <div className="App">
      <h1 className='myWord'>Welcome Here You Could Rent Cars And Hotels</h1>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0, marginLeft: '200px' }}>
          <li style={{ display: 'inline-block', marginRight: '40px' }}>
            <Link to="/">Home</Link>
          </li>
          <li style={{ display: 'inline-block', marginRight: '40px' }}>
            <Link to="/login">Login</Link>
          </li>
          <li style={{ display: 'inline-block', marginRight: '40px' }}>
            <Link to="/rentacar">Rent a Car</Link>
          </li>
          <li style={{ display: 'inline-block', marginRight: '40px' }}>
            <Link to="/MyCalendar">Rent A House</Link>
          </li>
          <li style={{ display: 'inline-block', marginRight: '40px' }}>
            <Link to="/ourdeals">Order History</Link>
          </li>
          <li style={{ display: 'inline-block' }}>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      {showImages && (
        <section className="image-gallery">
          <img src={image1} alt="Front View 1" />
          <img src={image2} alt="Front View 2" />
          <img src={image3} alt="Front View 3" />
          <img src={image4} alt="Front View 4" />
          <img src={image5} alt="Front View 5" />
        </section>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/tempPassword" element={<ResetPassword />} />
        <Route path="/newPassword" element={<NewPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rentacar" element={<ConstructorComponent cars={cars} />} />
        <Route path="/MyCalendar" element={<MyCalendar />} />
        <Route path="/ourdeals" element={<OrderHistory />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;






















