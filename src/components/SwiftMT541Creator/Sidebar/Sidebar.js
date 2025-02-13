import React, { useState } from 'react';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Default active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Update the active tab
    onSelectTab(tab); // Notify the parent component about the selected tab
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <ul className="sidebar-menu">
        <li
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => handleTabClick('dashboard')}
        >
          Dashboard
        </li>
        <li
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => handleTabClick('search')}
        >
          Search
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;