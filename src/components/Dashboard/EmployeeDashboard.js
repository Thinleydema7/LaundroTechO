// src/components/Dashboard/EmployeeDashboard.js

import React, { useEffect, useState } from 'react';

const EmployeeDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await fetch('/api/bookings');
        const machineRes = await fetch('/api/machines');
        const bookingData = await bookingRes.json();
        const machineData = await machineRes.json();
        setBookings(bookingData);
        setMachines(machineData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleComplete = async (bookingId) => {
    try {
      await fetch(`/api/bookings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: 'COMPLETED' }),
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'COMPLETED' } : b))
      );
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Employee Dashboard</h2>

      <section>
        <h3>Current Bookings</h3>
        {bookings.length === 0 ? (
          <p>No current bookings.</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                User ID: {booking.userId} | Machine: {booking.machineId} | Time:{' '}
                {new Date(booking.time).toLocaleString()} | Status: {booking.status}
                {booking.status === 'PENDING' && (
                  <button onClick={() => handleComplete(booking.id)}>Mark as Done</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Machine Status</h3>
        <ul>
          {machines.map((machine) => (
            <li key={machine.id}>
              {machine.name} - Status: {machine.status}
            </li>
          ))}
        </ul>
      </section>

      <style jsx>{`
        .dashboard {
          padding: 2rem;
        }
        h2 {
          color: #2c3e50;
        }
        section {
          margin-bottom: 2rem;
        }
        ul {
          padding-left: 1.5rem;
        }
        li {
          margin-bottom: 1rem;
        }
        button {
          margin-left: 1rem;
          padding: 0.3rem 0.6rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
