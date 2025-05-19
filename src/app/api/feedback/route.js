import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';

export async function POST(request) {
  try {
    const { userId, message, rating } = await request.json();
    
    await connectDB();
    
    const feedback = await Feedback.create({
      userId,
      message,
      rating,
      createdAt: new Date()
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
} 