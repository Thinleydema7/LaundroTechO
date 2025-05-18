import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in PUT:', session);

    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();
    console.log('Received update data:', data);
    
    // Validate input data
    if (!data.name?.trim()) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name: data.name.trim(),
        phone: data.phone?.trim() || '',
        address: data.address?.trim() || '',
      },
      { new: true, runValidators: true }
    );

    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      console.log('No user found with email:', session.user.email);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare response data
    const responseData = {
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: updatedUser.address || '',
      role: updatedUser.role
    };
    console.log('Response data:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session in GET:', session);

    if (!session) {
      return NextResponse.json(
        { message: 'You must be logged in.' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    console.log('Found user:', user);

    if (!user) {
      console.log('No user found with email:', session.user.email);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare response data
    const responseData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };
    console.log('Response data:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 