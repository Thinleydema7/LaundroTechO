import Booking from '@/models/Booking';
import Machine from '@/models/Machine';

/**
 * Check if a machine is available for booking at a specific time
 * @param {string} machineId - The ID of the machine to check
 * @param {Date} bookingTime - The time to check availability for
 * @returns {Promise<boolean>} - True if the machine is available, false otherwise
 */
export async function checkMachineAvailability(machineId, bookingTime) {
  const bookingDate = new Date(bookingTime);
  const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 999));

  // Get all active bookings for the machine on the same day
  const existingBookings = await Booking.find({
    machineId,
    time: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['PENDING', 'CONFIRMED'] }
  });

  // Get the machine type
  const machine = await Machine.findById(machineId);
  if (!machine) {
    throw new Error('Machine not found');
  }

  // Get the maximum allowed bookings based on machine type
  const maxBookings = machine.type === 'WASH_AND_FOLD' ? 2 : 1;

  // Check if the number of existing bookings is less than the maximum allowed
  const bookingsAtTime = existingBookings.filter(booking => 
    booking.time.getHours() === bookingDate.getHours()
  );

  return bookingsAtTime.length < maxBookings;
}

/**
 * Get available time slots for a specific date
 * @param {string} machineId - The ID of the machine to check
 * @param {Date} date - The date to check availability for
 * @returns {Promise<Array>} - Array of available time slots
 */
export async function getAvailableTimeSlots(machineId, date) {
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  const machine = await Machine.findById(machineId);
  if (!machine) {
    throw new Error('Machine not found');
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get all bookings for the machine on the specified date
  const existingBookings = await Booking.find({
    machineId,
    time: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['PENDING', 'CONFIRMED'] }
  });

  // Maximum bookings allowed per slot based on machine type
  const maxBookings = machine.type === 'WASH_AND_FOLD' ? 2 : 1;

  // Check availability for each time slot
  const availableSlots = await Promise.all(timeSlots.map(async (time) => {
    const [hours] = time.split(':');
    const slotTime = new Date(date);
    slotTime.setHours(parseInt(hours), 0, 0, 0);

    const bookingsInSlot = existingBookings.filter(booking => 
      booking.time.getHours() === parseInt(hours)
    );

    return {
      time,
      available: bookingsInSlot.length < maxBookings,
      remainingSlots: maxBookings - bookingsInSlot.length
    };
  }));

  return availableSlots;
} 