'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
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

    fetchMessages();
  }, [session, status, router]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'READ' }),
      });

      if (!res.ok) throw new Error('Failed to update message');
      await fetchMessages();
    } catch (err) {
      console.error('Error updating message:', err);
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
      <h1 className="text-3xl font-bold text-pink-600 mb-8">Contact Messages</h1>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              message.status === 'UNREAD' ? 'border-l-4 border-pink-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{message.name}</h3>
                <p className="text-gray-600">{message.email}</p>
              </div>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  message.status === 'UNREAD'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {message.status}
                </span>
                {message.status === 'UNREAD' && (
                  <button
                    onClick={() => handleMarkAsRead(message._id)}
                    className="ml-4 text-pink-600 hover:text-pink-700"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            <p className="text-gray-500 text-sm mt-4">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
} 