import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SwiftMT541Creator from './components/SwiftMT541Creator/SwiftMT541Creator';
import './App.css';
import Search from './components/SwiftMT541Creator/Search/Search';
import DashboardPage from './components/SwiftMT541Creator/Search/DashboardPage';
import Verify from './components/SwiftMT541Creator/Verify/Verify';
import Approve from './components/SwiftMT541Creator/Approve/Approve';
import Navbar from './components/SwiftMT541Creator/Navbar/Navbar';
import Sidebar from './components/SwiftMT541Creator/Sidebar/Sidebar';
import MT541OutputPage1 from './components/SwiftMT541Creator/MT541OutputPage/MT541OutputPage1';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <Router>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`main-content ${isSidebarOpen ? 'shift' : ''}`}>
          <Routes>
          <Route path="/mt541-output"  element={<MT541OutputPage1 />}/>
            <Route path="/" element={<SwiftMT541Creator />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/approve" element={<Approve />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;