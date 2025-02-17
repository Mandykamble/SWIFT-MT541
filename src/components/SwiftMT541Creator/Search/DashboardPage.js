// DashboardPage.jsx
import React from 'react';
import Dashboard from './Dashboard';
import dummyData1 from './dummyData1';
import Sidebar from '../Sidebar/Sidebar';

const DashboardPage = () => {
  return (
    
      <div className='mainmain'>
      
        <Sidebar onSelectTab={(tab) => console.log(tab)} />

        <Dashboard data={dummyData1} />
      
      {/* Sidebar */}
      </div>
      
   
  );
};

export default DashboardPage;