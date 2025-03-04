import React from 'react';
import './Navbar.css';
import logo from '../../../assets/logo.jpg';
import { FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = ({ toggleSidebar, handleLogout, user }) => {
  // For debugging - log the user object to see its structure
  console.log("User in Navbar:", user);
  
  // Extract user's name or use a fallback
  const userName = user?.name || user?.username || 'User';
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <FaBars className="navbar-hamburger" onClick={toggleSidebar} />
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="navbar-user">
          <div className="user-info">
            <FaUser className="user-icon" />
            <span className="username">{userName}</span>
          </div>
          <button className="signout-button" onClick={handleLogout}>
            <FaSignOutAlt className="signout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;