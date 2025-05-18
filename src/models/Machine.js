// src/models/Machine.js

import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['WASH_AND_FOLD', 'DRY_CLEANING', 'EXPRESS']
  },
  status: {
    type: String,
    required: true,
    enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE'],
    default: 'AVAILABLE'
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
}, {
  timestamps: true
});

const Machine = mongoose.models.Machine || mongoose.model('Machine', machineSchema);

export default Machine;
