import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFileInvoice,
  FaList,
  FaCheckCircle,
  FaPlusCircle,
  FaTasks,
  FaAngleDown,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css";
import logo from "../../../assets/logo.jpg"; // Importing logo

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Only for closing the sidebar
  const handleCloseClick = (e) => {
    e.stopPropagation();
    toggleSidebar();
  };

  return (
    <div className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <FaTimes className="sidebar-close" onClick={handleCloseClick} />
        </div>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/Dashboard" exact activeClassName="active">
              <FaHome className="icon" />
              <span className="menu-text">Dashboard</span>
            </NavLink>
          </li>

          {/* Message Management with Dropdown */}
          <li className="dropdown">
            <div className="dropdown-header" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <div className="dropdown-title">
                <FaTasks className="icon" />
                <span className="menu-text">Message Management</span>
              </div>
              <FaAngleDown className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`} />
            </div>

            <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
              <li>
                <NavLink to="/Search" activeClassName="active">
                  <FaList className="icon" />
                  <span className="menu-text">List Transaction</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/" activeClassName="active">
                  <FaPlusCircle className="icon" />
                  <span className="menu-text">Create Transaction</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/verify" activeClassName="active">
                  <FaCheckCircle className="icon" />
                  <span className="menu-text">Verify Transaction</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/approve" activeClassName="active">
                  <FaFileInvoice className="icon" />
                  <span className="menu-text">Approve</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;