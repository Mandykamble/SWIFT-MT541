import React from 'react';
import Dashboard from './Dashboard';
import dummyData1 from './dummyData1';
// import Sidebar from './Sidebar/Sidebar';

const DashboardPage = () => {
    return (
        <div>

        <div className="dashboard-page">
            <h1>Dashboard</h1>
            <Dashboard data={dummyData1} />
        </div>
        </div>
    );
};

export default DashboardPage;
