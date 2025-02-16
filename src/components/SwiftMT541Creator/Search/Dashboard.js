import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './Dashboard.css'; // Create a separate CSS file for styling

const Dashboard = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const myChart = echarts.init(chartRef.current);

            // Count the number of messages for each status
            const statusCounts = data.reduce((acc, item) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
            }, {});

            const chartData = Object.keys(statusCounts).map((key) => ({
                name: key,
                value: statusCounts[key],
            }));

            const option = {
                tooltip: { trigger: 'item' },
                legend: { top: '5%', left: 'center' },
                series: [
                    {
                        name: 'Transaction Status',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['50%', '70%'],
                        startAngle: 180,
                        endAngle: 360,
                        data: chartData.length ? chartData : [{ name: 'No Data', value: 1 }],
                    },
                ],
            };

            myChart.setOption(option);
        }
    }, [data]);

    return (
        <div className="dashboard-container">
            <h2>Transaction Distribution</h2>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
        </div>
    );
};

export default Dashboard;
