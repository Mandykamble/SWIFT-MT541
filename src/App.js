import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SwiftMT541Creator from './components/SwiftMT541Creator/SwiftMT541Creator';
import Search from './components/SwiftMT541Creator/Search/Search';
import DashboardPage from './components/SwiftMT541Creator/Search/DashboardPage';
import Verify from './components/SwiftMT541Creator/Verify/Verify';
import Approve from './components/SwiftMT541Creator/Approve/Approve';
import Navbar from './components/SwiftMT541Creator/Navbar/Navbar';
import Sidebar from './components/SwiftMT541Creator/Sidebar/Sidebar';
import MT541OutputPage1 from './components/SwiftMT541Creator/MT541OutputPage/MT541OutputPage1';
import Login from './components/SwiftMT541Creator/Login/Login';
import { getProfile, signOut } from './services/api';
import Swal from 'sweetalert2';
import './App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      try {
        const profile = await getProfile();
        setUser(profile.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      signOut();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    Swal.fire({
      title: 'Signed Out',
      text: 'You have been signed out successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        {isAuthenticated ? (
          <>
            <Navbar toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} />
            <div className="app-layout">
              <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Routes>
                  <Route path="/mt541-output" element={<MT541OutputPage1 />} />
                  <Route path="/createtransaction" element={<SwiftMT541Creator />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/verify" element={<Verify />} />
                  <Route path="/approve" element={<Approve />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
