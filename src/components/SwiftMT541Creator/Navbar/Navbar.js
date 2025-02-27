import React from 'react';
import './Navbar.css';
import logo from '../../../assets/logo.jpg'; // Ensure you have a logo image inside the assets folder
import { FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <FaBars className="navbar-hamburger" onClick={toggleSidebar} />
        <img src={logo} alt="Logo" className="navbar-logo" />
        {/* <h1 className="navbar-title">NCS Platform</h1> */}
      </div>
    </nav>
  );
};

export default Navbar;