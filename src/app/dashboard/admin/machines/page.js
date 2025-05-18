'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminMachinesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [machines, setMachines] = useState([]);
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

    fetchMachines();
  }, [session, status, router]);

  const fetchMachines = async () => {
    try {
      const res = await fetch('/api/machines');
      if (!res.ok) throw new Error('Failed to fetch machines');
      const data = await res.json();
      setMachines(data);
    } catch (err) {
      setError('Failed to load machines');
      console.error('Error fetching machines:', err);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600">Machines</h1>
        <button
          onClick={() => {/* Add machine creation logic */}}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
        >
          Add Machine
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{machine.name}</h3>
                <p className="text-sm text-gray-500">{machine.type.replace(/_/g, ' ')}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                machine.status === 'AVAILABLE'
                  ? 'bg-green-100 text-green-800'
                  : machine.status === 'IN_USE'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {machine.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Bookings:</span>
                <span className="font-medium">{machine.bookings?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Price per Hour:</span>
                <span className="font-medium">${machine.pricePerHour}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {/* Add edit logic */}}
                className="text-pink-600 hover:text-pink-900"
              >
                Edit
              </button>
              <button
                onClick={() => {/* Add delete logic */}}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {machines.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No machines found.
          </div>
        )}
      </div>
    </div>
  );
} 