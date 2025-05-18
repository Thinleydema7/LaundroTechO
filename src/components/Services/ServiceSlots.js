// src/components/Services/ServiceSlots.js

import { useState } from 'react';

const availableSlots = [
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
];

const ServiceSlots = ({ onSelect }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    if (onSelect) onSelect(slot);
  };

  return (
    <div className="slots-container">
      <h3>Select a Time Slot</h3>
      <ul className="slots-list">
        {availableSlots.map((slot, index) => (
          <li
            key={index}
            className={`slot-item ${selectedSlot === slot ? 'selected' : ''}`}
            onClick={() => handleSelect(slot)}
          >
            {slot}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .slots-container {
          margin-top: 1rem;
        }

        .slots-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .slot-item {
          padding: 0.6rem 1rem;
          background-color: #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .slot-item:hover {
          background-color: #d1d5db;
        }

        .selected {
          background-color: #3b82f6;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ServiceSlots;
