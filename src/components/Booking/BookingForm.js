// src/components/Booking/BookingForm.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const BookingForm = ({ machines, onSubmit }) => {
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!selectedMachine || !selectedTime) {
      setError('Please select a machine and a time.');
      return;
    }

    // Call the onSubmit function passed as a prop with the booking details
    onSubmit({ machineId: selectedMachine, time: selectedTime })
      .then(() => {
        // Redirect to the "booked" page after successful booking
        router.push('/bookings/booked');
      })
      .catch((err) => {
        setError('Failed to make the booking. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book a Machine</h2>

      {/* Machine Selection */}
      <div className="input-group">
        <label htmlFor="machine">Select Machine</label>
        <select
          id="machine"
          name="machine"
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
          required
          className="input-field"
        >
          <option value="">-- Select a Machine --</option>
          {machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name} ({machine.status})
            </option>
          ))}
        </select>
      </div>

      {/* Time Selection */}
      <div className="input-group">
        <label htmlFor="time">Select Time</label>
        <input
          type="datetime-local"
          id="time"
          name="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          required
          className="input-field"
        />
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Submit Button */}
      <button type="submit" className="submit-btn">
        Book Now
      </button>

      <style jsx>{`
        .booking-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          max-width: 400px;
          margin: 0 auto;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .input-group {
          width: 100%;
          margin-bottom: 1rem;
        }

        .input-group label {
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .input-field:focus {
          border-color: #3498db;
        }

        .error {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .submit-btn {
          padding: 12px 25px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #2980b9;
        }
      `}</style>
    </form>
  );
};

export default BookingForm;
