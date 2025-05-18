// src/components/Dashboard/UserDashboard.js

import React, { useEffect, useState } from 'react';

const UserDashboard = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const bookingsRes = await fetch('/api/bookings');
        const machinesRes = await fetch('/api/machines');

        const allBookings = await bookingsRes.json();
        const allMachines = await machinesRes.json();

        const userBookings = allBookings.filter(b => b.userId === userId);

        setBookings(userBookings);
        setMachines(allMachines);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <p>Loading your dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Welcome to Your Dashboard</h2>

      <section>
        <h3>Your Bookings</h3>
        {bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id}>
                Machine #{booking.machineId} on{' '}
                {new Date(booking.time).toLocaleString()} — Status:{' '}
                <strong>{booking.status}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>Available Machines</h3>
        <ul>
          {machines
            .filter((m) => m.status === 'AVAILABLE')
            .map((machine) => (
              <li key={machine.id}>{machine.name}</li>
            ))}
        </ul>
      </section>

      <style jsx>{`
        .dashboard {
          padding: 2rem;
        }
        h2 {
          margin-bottom: 1rem;
        }
        section {
          margin-bottom: 2rem;
        }
        ul {
          padding-left: 1.2rem;
        }
        li {
          margin-bottom: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
