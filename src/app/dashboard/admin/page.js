'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    unreadMessages: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsRes = await fetch('/api/bookings');
      const bookings = await bookingsRes.json();
      
      // Fetch messages
      const messagesRes = await fetch('/api/contact');
      const messages = await messagesRes.json();

      // Calculate stats
      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        totalUsers: 0, // This would need a separate API endpoint
        unreadMessages: messages.filter(m => m.status === 'UNREAD').length
      });

      // Set recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));

      // Set recent messages (last 5)
      setRecentMessages(messages.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-pink-600 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Bookings</h2>
          <p className="text-3xl font-bold text-pink-600 mt-2">{stats.totalBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Pending Bookings</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
        </div>

        <Link href="/dashboard/admin/messages" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-700">Unread Messages</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.unreadMessages}</p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Recent Bookings</h2>
            <Link href="/dashboard/admin/bookings" className="text-sm text-pink-600 hover:text-pink-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{booking.user?.name}</p>
                    <p className="text-sm text-gray-600">{booking.machine?.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.time).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'CONFIRMED' 
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Recent Messages</h2>
            <Link href="/dashboard/admin/messages" className="text-sm text-pink-600 hover:text-pink-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{message.name}</p>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{message.message}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    message.status === 'READ'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.status}
                  </span>
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent messages</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 