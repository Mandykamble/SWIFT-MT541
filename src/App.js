// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SwiftMT541Creator from './components/SwiftMT541Creator/SwiftMT541Creator';
import './App.css';
import Search from './components/SwiftMT541Creator/Search/Search'; // Import the Search component

import Navbar from './components/SwiftMT541Creator/Navbar/Navbar'
function App() {
  return (
    
    <div className="App">
      <Router>
      <Navbar/>
      <Routes>
      <Route path="/dashboard" element={<SwiftMT541Creator />} />
        <Route path="/" element={<SwiftMT541Creator />} />
        <Route path="/search" element={<Search />} />
        
      </Routes>
      
    </Router>
    </div>
  );
}

export default App;