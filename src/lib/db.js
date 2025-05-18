// src/lib/db.js

import mongoose from 'mongoose';
import connectDB from './mongodb';
import User from '../models/User';
import Machine from '../models/Machine';
import Booking from '../models/Booking';

// User operations
export async function createUser(userData) {
  await connectDB();
  return await User.create(userData);
}

export async function getUserByEmail(email) {
  await connectDB();
  return await User.findOne({ email });
}

export async function getUserById(id) {
  await connectDB();
  return await User.findById(id);
}

export async function updateUserDetails(userId, data) {
  await connectDB();
  return await User.findByIdAndUpdate(userId, data, { new: true });
}

export async function deleteUser(userId) {
  await connectDB();
  return await User.findByIdAndDelete(userId);
}

// Machine operations
export async function createMachine(machineData) {
  await connectDB();
  return await Machine.create(machineData);
}

export async function getMachineById(machineId) {
  await connectDB();
  return await Machine.findById(machineId);
}

export async function getAllMachines() {
  await connectDB();
  return await Machine.find({});
}

export async function updateMachineStatus(machineId, status) {
  await connectDB();
  return await Machine.findByIdAndUpdate(machineId, { status }, { new: true });
}

export async function deleteMachine(machineId) {
  await connectDB();
  return await Machine.findByIdAndDelete(machineId);
}

// Booking operations
export async function createBooking(bookingData) {
  await connectDB();
  return await Booking.create(bookingData);
}

export async function getBookingById(bookingId) {
  await connectDB();
  return await Booking.findById(bookingId).populate('userId machineId');
}

export async function getBookingsByUserId(userId) {
  await connectDB();
  return await Booking.find({ userId }).populate('machineId').sort({ time: -1 });
}

export async function updateBookingStatus(bookingId, status) {
  await connectDB();
  return await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
}

export async function cancelBooking(bookingId) {
  return await updateBookingStatus(bookingId, 'CANCELLED');
}

export async function deleteBooking(bookingId) {
  await connectDB();
  return await Booking.findByIdAndDelete(bookingId);
}

// Close database connection
export async function closeDbConnection() {
  await mongoose.connection.close();
}
