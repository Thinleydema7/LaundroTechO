'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update booking');
      await fetchBookings();
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-pink-600 mb-8">Bookings</h1>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Machine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.user?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.machine?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.machine?.type}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.serviceType}
                  </div>
                  <div className="text-sm text-gray-500">
                    Nu.{booking.price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(booking.time).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.time).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : booking.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
} 