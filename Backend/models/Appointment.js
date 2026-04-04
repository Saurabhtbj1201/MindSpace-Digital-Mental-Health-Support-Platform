const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  bookingId: {
    type: String,
    unique: true,
    sparse: true
  },
  specialist: {
    id: String,
    name: String,
    email: String,
    specialty: String,
    image: String
  },
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['Video', 'Audio', 'Chat']
  },
  concern: {
    type: String
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate appointment number before saving if not present
AppointmentSchema.pre('validate', function(next) {
  if (!this.appointmentNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `APT-${timestamp}-${random}`;
    this.appointmentNumber = generatedId;
    this.bookingId = generatedId;
  }
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
