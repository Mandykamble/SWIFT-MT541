import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { FaHome, FaFileInvoice, FaList, FaCheckCircle, FaPlusCircle, FaTasks } from "react-icons/fa";
import logo from "../../../assets/logo.jpg"; // Importing logo
 
const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="sidebar-logo" />
                <span>NCS PLATFORM</span>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/Dashboard" exact activeClassName="active">
                        <FaHome className="icon" /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/Search" activeClassName="active">
                        <FaTasks className="icon" /> Transaction
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/" activeClassName="active">
                        <FaPlusCircle className="icon" /> Create Transaction
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/list" activeClassName="active">
                        <FaList className="icon" /> List Transaction
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/verify" activeClassName="active">
                        <FaCheckCircle className="icon" /> Verify Transaction
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/approve" activeClassName="active">
                        <FaFileInvoice className="icon" /> Approve
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};
 
export default Sidebar;