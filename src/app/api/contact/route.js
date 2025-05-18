import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Validate required fields
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create new contact message
    const contact = await Contact.create({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Contact fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id, status } = await request.json();

    const message = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!message) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Contact update error:', error);
    return NextResponse.json(
      { message: 'Failed to update message' },
      { status: 500 }
    );
  }
} 