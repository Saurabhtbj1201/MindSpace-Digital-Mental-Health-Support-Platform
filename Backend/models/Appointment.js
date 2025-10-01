const mongoose = require('mongoose');

// Helper to generate a unique booking ID
function generateBookingId() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `APT-${ts}-${rand}`;
}

const appointmentSchema = new mongoose.Schema({
    // Patient Information
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    patientEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    patientPhone: {
        type: String,
        required: true,
        trim: true
    },

    // Specialist Information
    specialistId: {
        type: String,
        required: true
    },
    specialistName: {
        type: String,
        required: true
    },
    specialistRole: {
        type: String,
        required: true
    },
    specialistSpecialty: {
        type: String,
        required: true
    },

    // Appointment Details
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 60 // in minutes
    },

    // Counseling Type
    counselingType: {
        type: String,
        required: true,
        enum: ['video-call', 'phone-call', 'in-office'],
        default: 'video-call'
    },

    // Additional Information
    concerns: {
        type: String,
        trim: true
    },

    // Booking Details
    bookingId: {
        type: String,
        required: true,
        unique: true,
        default: generateBookingId
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },

    // Payment Information
    consultationFee: {
        type: Number,
        required: true,
        default: 1500
    },
    platformFee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },

    // Meeting Details (for video/phone calls)
    meetingLink: {
        type: String
    },
    meetingId: {
        type: String
    },

    // Office Details (for in-office appointments)
    officeAddress: {
        type: String,
        default: 'MindSpace Center, Main Branch'
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field before saving
appointmentSchema.pre('save', function(next) {
    // Ensure bookingId is set (backstop)
    if (!this.bookingId) {
        this.bookingId = generateBookingId();
    }
    // Auto-calc total if not provided
    if (this.totalAmount == null) {
        this.totalAmount = (this.consultationFee || 0) + (this.platformFee || 0);
    }
    this.updatedAt = Date.now();
    next();
});

// Index for efficient queries
appointmentSchema.index({ patientEmail: 1, appointmentDate: 1 });
appointmentSchema.index({ specialistId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
// Ensure unique bookingId index exists
appointmentSchema.index({ bookingId: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);