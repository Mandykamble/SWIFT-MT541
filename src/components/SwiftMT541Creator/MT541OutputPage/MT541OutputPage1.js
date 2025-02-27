import React from 'react';
import { useLocation } from 'react-router-dom';

const MT541OutputPage = () => {
  const location = useLocation();
  const { swiftMessage } = location.state || { swiftMessage: 'No data available' };

  return (
    <div className="mt541-output-page">
      <h1>Generated MT541 Message</h1>
      <pre>{swiftMessage}</pre>
    </div>
  );
};

export default MT541OutputPage;