// src/App.js
import React from 'react';
import SwiftMT541Creator from './components/SwiftMT541Creator/SwiftMT541Creator';
import './App.css';
import Sidebar from './components/SwiftMT541Creator/Sidebar/Sidebar'
import Navbar from './components/SwiftMT541Creator/Navbar/Navbar'
function App() {
  return (
    <div className="App">
      <Navbar/>
      <SwiftMT541Creator />
    </div>
  );
}

export default App;