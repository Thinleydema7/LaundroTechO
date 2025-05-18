import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getAvailableTimeSlots } from '@/utils/bookingUtils';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const machineId = searchParams.get('machineId');
    const date = searchParams.get('date');

    if (!machineId || !date) {
      return NextResponse.json(
        { message: 'Machine ID and date are required' },
        { status: 400 }
      );
    }

    // Get available time slots
    const availableSlots = await getAvailableTimeSlots(machineId, new Date(date));

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to check availability' },
      { status: 500 }
    );
  }
} 