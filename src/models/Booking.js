// src/models/Booking.js

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  serviceType: {
    type: String,
    enum: ['WASH_AND_FOLD', 'DRY_CLEANING', 'EXPRESS'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

// Add index for querying bookings by time
bookingSchema.index({ time: 1 });

// Add compound index for checking machine availability
bookingSchema.index({ machineId: 1, time: 1 });

// Update timestamp before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
