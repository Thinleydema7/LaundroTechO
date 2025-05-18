'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setError('');
      const res = await fetch('/api/bookings');
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }

      const data = await res.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from server');
      }

      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      setError('');
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'DONE' }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update booking status');
      }

      await fetchBookings(); // refresh list
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.message || 'Failed to update booking status. Please try again.');
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'EMPLOYEE' || session?.user?.role === 'ADMIN') {
      fetchBookings();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session || (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">This area is restricted to employees only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-800">Employee Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'ALL' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setStatusFilter('PENDING')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'PENDING' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setStatusFilter('DONE')}
            className={`px-4 py-2 rounded ${
              statusFilter === 'DONE' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No bookings available for the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings
            .filter(booking => statusFilter === 'ALL' || booking.status === statusFilter)
            .map((booking) => (
              <div 
                key={booking.id} 
                className={`border rounded-lg shadow-sm p-6 ${
                  booking.status === 'DONE' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{booking.user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{booking.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Machine</p>
                    <p className="font-medium">{booking.machine?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{new Date(booking.time).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'DONE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.status !== 'DONE' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.id)}
                          className="ml-2 px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
