'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();

      const userBookings = data.filter(
        (booking) => booking.user.email === session?.user?.email
      );

      setBookings(userBookings);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUserBookings();
    }
  }, [session]);

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) return <p>Please sign in to access your dashboard.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded shadow">
              <p><strong>Machine:</strong> {booking.machine.name}</p>
              <p><strong>Time:</strong> {new Date(booking.time).toLocaleString()}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
