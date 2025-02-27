import React from 'react';
import Dashboard from './Dashboard';
import dummyData1 from './dummyData1';
import Sidebar from '../Sidebar/Sidebar';

const DashboardPage = () => {
  return (
    <div className="main-container">
      {/* Sidebar */}
      <Sidebar onSelectTab={(tab) => console.log(tab)} />

      {/* Dashboard Content */}
      <div className="main-content">
        <Dashboard data={dummyData1} />
      </div>
    </div>
  );
};

export default DashboardPage;
