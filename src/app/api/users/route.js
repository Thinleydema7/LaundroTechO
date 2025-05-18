import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET all users (admin only)
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
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error('[USERS_GET_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['USER', 'EMPLOYEE', 'ADMIN'];
    if (!validRoles.includes(role.toUpperCase())) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toUpperCase(),
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('[USER_CREATE_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT update user (admin only)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, name, email, role, active } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Prevent self-role change
    if (session.user.email === email && role !== session.user.role) {
      return NextResponse.json(
        { message: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role.toUpperCase();
    if (typeof active === 'boolean') updateData.active = active;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_UPDATE_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (admin only)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Prevent self-deletion
    const userToDelete = await User.findById(id);
    if (userToDelete.email === session.user.email) {
      return NextResponse.json(
        { message: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User deleted successfully' }
    );
  } catch (error) {
    console.error('[USER_DELETE_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 