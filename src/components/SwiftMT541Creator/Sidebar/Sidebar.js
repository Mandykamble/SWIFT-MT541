import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './Sidebar.css';

const Sidebar = ({ onSelectTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard" onClick={() => onSelectTab('dashboard') } className='txt'>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/search" onClick={() => onSelectTab('search')} className='txt'>
            Search
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;