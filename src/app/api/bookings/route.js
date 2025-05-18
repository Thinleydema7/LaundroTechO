import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import Machine from '@/models/Machine';
import { checkMachineAvailability } from '@/utils/bookingUtils';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    let bookings;
    
    // If employee or admin, get all bookings
    if (session.user.role === 'EMPLOYEE' || session.user.role === 'ADMIN') {
      bookings = await Booking.find()
        .populate({
          path: 'userId',
          select: 'name email'
        })
        .populate('machineId')
        .sort({ time: -1 });
    } else {
      // If regular user, only get their bookings
      bookings = await Booking.find({ userId: session.user.id })
        .populate('machineId')
        .sort({ time: -1 });
    }

    // Transform the data to match the expected format
    const formattedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      user: booking.userId ? {
        name: booking.userId.name,
        email: booking.userId.email
      } : null,
      machine: booking.machineId ? {
        name: booking.machineId.name,
        id: booking.machineId._id.toString(),
        type: booking.machineId.type
      } : null,
      time: booking.time,
      status: booking.status,
      serviceType: booking.serviceType,
      price: booking.price
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('[BOOKING_GET_ERROR]', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { machineId, time } = await req.json();

    // Validate required fields
    if (!machineId || !time) {
      return NextResponse.json(
        { message: 'Machine ID and time are required' },
        { status: 400 }
      );
    }

    // Check if machine exists
    const machine = await Machine.findById(machineId);
    if (!machine) {
      return NextResponse.json(
        { message: 'Machine not found' },
        { status: 404 }
      );
    }

    if (machine.status !== 'AVAILABLE') {
      return NextResponse.json(
        { message: 'Machine is not available' },
        { status: 400 }
      );
    }

    // Check machine availability for the requested time
    const isAvailable = await checkMachineAvailability(machineId, new Date(time));
    if (!isAvailable) {
      return NextResponse.json(
        { message: 'This time slot is not available for the selected machine' },
        { status: 400 }
      );
    }

    // Set price based on machine type
    const prices = {
      WASH_AND_FOLD: 100,
      DRY_CLEANING: 150,
      EXPRESS: 200
    };

    // Create the booking
    const booking = await Booking.create({
      userId: session.user.id,
      machineId,
      time: new Date(time),
      status: 'PENDING',
      serviceType: machine.type,
      price: prices[machine.type] || 100
    });

    // Update machine's bookings array
    await Machine.findByIdAndUpdate(
      machineId,
      { $push: { bookings: booking._id } }
    );

    // Return formatted booking
    const formattedBooking = {
      id: booking._id.toString(),
      user: {
        name: session.user.name,
        email: session.user.email
      },
      machine: {
        name: machine.name,
        id: machine._id.toString(),
        type: machine.type
      },
      time: booking.time,
      status: booking.status,
      price: booking.price,
      serviceType: booking.serviceType
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('[BOOKING_POST_ERROR]', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'EMPLOYEE' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { id, status } = await req.json();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate({
      path: 'userId',
      select: 'name email'
    }).populate('machineId');

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const formattedBooking = {
      id: booking._id.toString(),
      user: {
        name: booking.userId.name,
        email: booking.userId.email
      },
      machine: {
        name: booking.machineId.name,
        id: booking.machineId._id.toString(),
        type: booking.machineId.type
      },
      time: booking.time,
      status: booking.status,
      serviceType: booking.serviceType,
      price: booking.price
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('[BOOKING_UPDATE_ERROR]', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
