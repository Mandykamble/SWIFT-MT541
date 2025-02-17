// Dashboard.jsx
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Dashboard = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart = null;

    const initChart = () => {
      if (chartRef.current) {
        chart = echarts.init(chartRef.current);
        
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
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            top: '5%',
            left: 'center',
            textStyle: {
              fontSize: 14
            }
          },
          series: [
            {
              name: 'Transaction Status',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '60%'],
              avoidLabelOverlap: true,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: true,
                fontSize: 14,
                formatter: '{b}: {d}%'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold'
                }
              },
              data: chartData.length ? chartData : [{ name: 'No Data', value: 1 }],
            }
          ]
        };

        chart.setOption(option);
      }
    };

    initChart();

    const handleResize = () => {
      if (chart) {
        chart.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Call resize immediately after initialization
    setTimeout(() => {
      handleResize();
    }, 0);

    return () => {
      chart?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-3rem)]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Transaction Distribution
      </h2>
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%',
          height: '600px'
        }}
      />
    </div>
  );
};

export default Dashboard;