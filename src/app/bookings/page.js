'use client';

import { useState } from 'react';

export default function BookingsPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', { selectedDate, selectedTime });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-600 mb-8">Book Your Laundry Service</h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Slot
          </label>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-3 text-center rounded-md transition-colors duration-200 ${
                  selectedTime === time
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-primary-50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}
