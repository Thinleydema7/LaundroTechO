import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['USER', 'EMPLOYEE', 'ADMIN'];
    const upperRole = role.toUpperCase();
    if (!validRoles.includes(upperRole)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user (password will be hashed by the pre-save hook)
    console.log('Creating user...');
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password,  // The password will be hashed by the pre-save hook
      role: upperRole,
    });

    // Return user without password
    console.log('User created successfully');
    const userObject = user.toObject();
    delete userObject.password;
    
    return NextResponse.json(
      { message: 'User created successfully', user: userObject },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}
