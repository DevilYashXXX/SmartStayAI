import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Home from './components/Home';
import About from './components/About';
import Support from './components/Support';
import UserProfile from './components/UserProfile';
import Checkout from './components/Checkout';
import Registration from './pages/RegisterPage'; 
import OwnerDashboard from './pages/OwnerDashboard'; 
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard'; 
import PropertiesPage from './pages/PropertiesPage';
import NavBar from './components/navbar'; 
import { CartProvider } from './context/CartContext';

import './App.css';
import logo from './assets/logo.png'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <header className="header">
            <div className="header-logo">
              <img src={logo} alt="SmartStay AI Logo" className="logo-image" />
            </div>
             <h1 className="header-title">SmartStay AI</h1>
            <p className="slogan">Find Your Perfect Student Accommodation</p>
            <NavBar />
           </header>
           <main>
             <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/about" element={<About />} />
               <Route path="/support" element={<Support />} />
               <Route path="/profile" element={<UserProfile />} />
               <Route path="/booking-request" element={<Checkout />} />
               <Route path="/checkout" element={<Checkout />} />
               <Route path="/register" element={<Registration />} />
               <Route path="/owner-dashboard" element={<OwnerDashboard />} />
               <Route path="/seller-dashboard" element={<OwnerDashboard />} />
               <Route path="/admin-dashboard" element={<AdminDashboard />} />
               <Route path="/properties" element={<PropertiesPage />} />
               <Route path="/products" element={<PropertiesPage />} />
               <Route path="/wishlist" element={<CartPage />} />
               <Route path="/cart" element={<CartPage />} />
              </Routes>
            </main>
            <footer className="footer">
              <p>&copy; 2026 SmartStay AI. All rights reserved.</p>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
