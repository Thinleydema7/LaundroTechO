// src/components/Booking/MachineStatus.js

import React from 'react';

const MachineStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'green';
      case 'IN_USE':
        return 'orange';
      case 'UNDER_MAINTENANCE':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="machine-status">
      <h3>Machine Status</h3>
      <p
        className="status-indicator"
        style={{ backgroundColor: getStatusColor(status) }}
      >
        {status}
      </p>

      <style jsx>{`
        .machine-status {
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .status-indicator {
          padding: 10px 20px;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          border-radius: 5px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default MachineStatus;
