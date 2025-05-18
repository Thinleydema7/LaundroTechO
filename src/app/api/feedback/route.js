import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(feedbacks, { status: 200 });
  } catch (error) {
    console.error('[FEEDBACK_GET_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    const newFeedback = await prisma.feedback.create({
      data: {
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Feedback submitted', feedback: newFeedback }, { status: 201 });
  } catch (error) {
    console.error('[FEEDBACK_POST_ERROR]', error);
    return NextResponse.json({ message: 'Failed to submit feedback' }, { status: 500 });
  }
}
