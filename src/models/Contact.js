import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  status: {
    type: String,
    enum: ['UNREAD', 'READ'],
    default: 'UNREAD',
  },
}, {
  timestamps: true,
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact; 