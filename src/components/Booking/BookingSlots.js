// src/components/Booking/BookingSlots.js

import React from 'react';

const BookingSlots = ({ slots, onSelectSlot }) => {
  return (
    <div className="booking-slots">
      <h3>Available Time Slots</h3>
      {slots.length === 0 ? (
        <p>No available slots for booking at the moment.</p>
      ) : (
        <ul className="slots-list">
          {slots.map((slot) => (
            <li key={slot} className="slot-item">
              <button
                className="slot-btn"
                onClick={() => onSelectSlot(slot)}
              >
                {slot}
              </button>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .booking-slots {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h3 {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .slots-list {
          list-style-type: none;
          padding: 0;
        }

        .slot-item {
          margin-bottom: 0.8rem;
        }

        .slot-btn {
          padding: 10px 20px;
          background-color: #3498db;
          color: white;
          font-size: 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .slot-btn:hover {
          background-color: #2980b9;
        }

        .slot-btn:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default BookingSlots;
