import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import './Search.css';
import dummyData1 from './dummyData1';
import Sidebar from '../Sidebar/Sidebar';
import Dashboard from './Dashboard';

const Search = () => {
    // State for form fields
    const [messageFormat, setMessageFormat] = useState('All - MT & MX');
    const [messageRef, setMessageRef] = useState('');
    const [rfcRef, setRfcRef] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [messageType, setMessageType] = useState('');
    const [messageDirection, setMessageDirection] = useState('');
    const [senderBIC, setSenderBIC] = useState('');
    const [receiverBIC, setReceiverBIC] = useState('');
    const [status, setStatus] = useState('');
    
    // State for search results and pagination
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    
    // Ref for the chart container
    const chartRef = useRef(null);

    // Dummy data for testing
    const dummyData = dummyData1;

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Get current page data
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return searchResults.slice(startIndex, endIndex);
    };

    const handleSearch = () => {
        const results = dummyData.filter(
            (item) =>
                (messageFormat === 'All - MT & MX' || item.messageFormat === messageFormat) &&
                (messageRef === '' || item.messageRef.includes(messageRef)) &&
                (rfcRef === '' || item.rfcRef.includes(rfcRef)) &&
                (!startDate || item.startDate >= startDate) &&
                (!endDate || item.endDate <= endDate) &&
                (!messageType || item.messageType === messageType) &&
                (!messageDirection || item.messageDirection === messageDirection) &&
                (senderBIC === '' || item.senderBIC.includes(senderBIC)) &&
                (receiverBIC === '' || item.receiverBIC.includes(receiverBIC)) &&
                (!status || item.status === status)
        );
        setSearchResults(results);
        setTotalPages(Math.ceil(results.length / itemsPerPage));
        setCurrentPage(1);
        updateChart(results);
    };

    const updateChart = (data) => {
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
    };

    // Initialize the chart
    useEffect(() => {
        updateChart(dummyData);
        setSearchResults(dummyData);
        setTotalPages(Math.ceil(dummyData.length / itemsPerPage));
    }, []);

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setTotalPages(Math.ceil(searchResults.length / newItemsPerPage));
        setCurrentPage(1);
    };

    // Accordion toggle function
    const toggleAccordion = (e) => {
        e.target.classList.toggle('active');
        const panel = e.target.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    };

    return (
        <div className="main-container">
            <Sidebar onSelectTab={(tab) => console.log(tab)} />
            <div className="search-container">
                <h1>Transaction View</h1>

                {/* Accordion for Input Form */}
                <button className="accordion" onClick={toggleAccordion}>Search Filters</button>
                <div className="panel">
                    <div className="search-form">
                        {/* Row 1 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Message Format</label>
                                <select
                                    value={messageFormat}
                                    onChange={(e) => setMessageFormat(e.target.value)}
                                >
                                    <option value="All - MT & MX">All - MT & MX</option>
                                    <option value="MT">MT</option>
                                    <option value="MX">MX</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message Reference</label>
                                <input
                                    type="text"
                                    value={messageRef}
                                    onChange={(e) => setMessageRef(e.target.value)}
                                    placeholder="Enter Message Reference"
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Starting Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Ending Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message Type</label>
                                <select
                                    value={messageType}
                                    onChange={(e) => setMessageType(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="MT541">MT541</option>
                                    <option value="MT103">MT103</option>
                                    <option value="MX009">MX009</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Message Direction</label>
                                <select
                                    value={messageDirection}
                                    onChange={(e) => setMessageDirection(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Incoming">Incoming</option>
                                    <option value="Outgoing">Outgoing</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Sender BIC</label>
                                <input
                                    type="text"
                                    value={senderBIC}
                                    onChange={(e) => setSenderBIC(e.target.value)}
                                    placeholder="Enter Sender BIC"
                                />
                            </div>
                            <div className="form-group">
                                <label>Receiver BIC</label>
                                <input
                                    type="text"
                                    value={receiverBIC}
                                    onChange={(e) => setReceiverBIC(e.target.value)}
                                    placeholder="Enter Receiver BIC"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <button className="search-button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>

                {/* Accordion for Search Results */}
                <button className="accordion" onClick={toggleAccordion}>Search Results</button>
                <div className="panel">
                    <div className="search-results">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Message Format</th>
                                        <th>Message Reference</th>
                                        <th>RFC Reference</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Message Type</th>
                                        <th>Message Direction</th>
                                        <th>Sender BIC</th>
                                        <th>Receiver BIC</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getCurrentPageData().map((result, index) => (
                                        <tr key={index}>
                                            <td>{result.messageFormat}</td>
                                            <td>{result.messageRef}</td>
                                            <td>{result.rfcRef}</td>
                                            <td style={{ width: '100px'}}>{result.startDate}</td>
                                            <td style={{ width: '100px'}}>{result.endDate}</td>
                                            <td>{result.messageType}</td>
                                            <td>{result.messageDirection}</td>
                                            <td>{result.senderBIC}</td>
                                            <td>{result.receiverBIC}</td>
                                            <td>{result.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="pagination-container">
                            <div className="pagination-controls">
                                <button 
                                    onClick={() => handlePageChange(1)} 
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    First
                                </button>
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    className="pagination-button"
                                >
                                    Previous
                                </button>
                                <span className="page-info">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
                                    Next
                                </button>
                                <button 
                                    onClick={() => handlePageChange(totalPages)} 
                                    disabled={currentPage === totalPages}
                                    className="pagination-button"
                                >
                                    Last
                                </button>
                            </div>
                            <div className="items-per-page">
                                <label>Items per page:</label>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={handleItemsPerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible Transaction Distribution Section */}
                <details>
                    <summary><h2>Transaction Distribution</h2></summary>
                    <div className="chart-container">
                        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
                    </div>
                </details>

                {/* Dashboard Section */}
                <div>
                    <Dashboard data={searchResults} />
                </div>
            </div>
        </div>
    );
};

export default Search;