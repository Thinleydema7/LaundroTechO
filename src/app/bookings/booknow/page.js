'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BookNowPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch('/api/machines');
        if (!res.ok) {
          throw new Error('Failed to fetch machines');
        }
        const data = await res.json();
        setMachines(data.filter(machine => machine.status === 'AVAILABLE'));
        setLoading(false);
      } catch (error) {
        console.error('Failed to load machines:', error);
        setError('Failed to load available machines. Please try again later.');
        setLoading(false);
      }
    };

    if (session) {
      fetchMachines();
    }
  }, [session]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedMachine || !selectedDate) return;

      try {
        const res = await fetch(`/api/availability?machineId=${selectedMachine}&date=${selectedDate}`);
        if (!res.ok) throw new Error('Failed to fetch availability');
        const data = await res.json();
        setAvailableSlots(data);
        setSelectedTime(''); // Reset selected time when machine or date changes
      } catch (error) {
        console.error('Failed to fetch availability:', error);
        setError('Failed to load available time slots. Please try again later.');
      }
    };

    fetchAvailableSlots();
  }, [selectedMachine, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!selectedMachine || !selectedDate || !selectedTime) {
        throw new Error('Please select a machine, date, and time');
      }

      // Combine date and time
      const bookingDateTime = new Date(selectedDate + 'T' + selectedTime);
      
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId: selectedMachine,
          time: bookingDateTime.toISOString()
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create booking');
      }

      router.push('/bookings/booked');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-center text-lg">Please sign in to book a machine.</p>
      </div>
    );
  }

  const selectedMachineData = machines.find(m => m.id === selectedMachine);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Book a Machine</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <div>
          <label htmlFor="machine" className="block text-sm font-medium text-gray-700 mb-2">
            Select Machine
          </label>
          <select
            id="machine"
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">-- Select a Machine --</option>
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.name} - {machine.type.replace(/_/g, ' ')}
                {machine.type === 'WASH_AND_FOLD' ? ' (2 slots per hour)' : ' (1 slot per hour)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        {selectedMachine && selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 text-center rounded-md transition-colors duration-200 ${
                    selectedTime === slot.time
                      ? 'bg-primary-600 text-white'
                      : slot.available
                      ? 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                  {slot.available && (
                    <span className="block text-xs">
                      {slot.remainingSlots} slot{slot.remainingSlots !== 1 ? 's' : ''} left
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !selectedTime}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
          >
            {submitting ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
