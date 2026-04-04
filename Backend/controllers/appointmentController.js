const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or any other email service
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email
    pass: process.env.EMAIL_PASSWORD // Your email password or app-specific password
  }
});

// List of specialists
const specialists = [
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@mindspace.com',
    specialty: 'Clinical Psychologist',
    description: 'Specializing in cognitive behavioral therapy and mindfulness-based stress reduction for high-performance professionals.',
    rating: 4.9,
    reviews: 124,
    price: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_IAUhv5YAOrgKy5EDfAF6wpWTl7X38l0WvY42adycO_MaxX6OoJL_hlqIC2OjuE5L9q-p7yZ8bvUoRHEpbXMdXmibwSURLIXnLrEv6ajUPDIwdHnRkAJh3_keABEQLrPIbZy9t_h2mNbtfa73WhNG45dZxguNoaC55TewGfHGRxd3eT_yaod6XwPX-0CMINK8SgSmieK3TiuSJ4E5ZwLt7mNbWZVkUBLYH_kwf6y8PedK7n4izUzJyMjyKowi8b759AhkTTqK4uA'
  },
  {
    id: 'marcus-thorne',
    name: 'Marcus Thorne',
    email: 'marcus.thorne@mindspace.com',
    specialty: 'Relationship Specialist',
    description: 'Passionate about helping couples and individuals navigate transition periods with compassion and clear communication.',
    rating: 4.8,
    reviews: 89,
    price: 95,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZnS6Ep1rNNCxGz3DVrM9IIfY7OzQPyvnpmdpzxCdrylEdpwkB_MsCa9unc92RVehJexUSt93ZL-bK7Yu6GnZrPTgtD-zkxB_Z46DK02RLXpRoQ9otevk7mAjqYnS2psF9IkwF5vFd3JQVfJ5MlZsqr9e0OtFJR1E_I40oWNDNuRfljXubI8Szo0vBSQoOkd-8CVo834mUichuk_hE6ZuR9nnWjXmGddlkx2jVRyd6csMKy4OOX3yUXd5Xw_eTRcJqL-PSAdJoms'
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@mindspace.com',
    specialty: 'Anxiety & Stress Specialist',
    description: 'Expert in treating anxiety disorders, panic attacks, and stress management using evidence-based therapeutic approaches.',
    rating: 4.9,
    reviews: 156,
    price: 110,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  },
  {
    id: 'dr-james-cooper',
    name: 'Dr. James Cooper',
    email: 'james.cooper@mindspace.com',
    specialty: 'Depression & Trauma Therapist',
    description: 'Specialized in depression treatment, PTSD, and trauma recovery with over 15 years of clinical experience.',
    rating: 4.7,
    reviews: 98,
    price: 130,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
  },
  {
    id: 'dr-emily-watson',
    name: 'Dr. Emily Watson',
    email: 'emily.watson@mindspace.com',
    specialty: 'Teen & Young Adult Counselor',
    description: 'Dedicated to supporting teenagers and young adults through life transitions, identity issues, and academic stress.',
    rating: 4.8,
    reviews: 112,
    price: 100,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
  }
];

// Get all specialists
exports.getSpecialists = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      specialists
    });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching specialists',
      error: error.message
    });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { specialistId, patientName, patientEmail, date, time, sessionType, concern } = req.body;
    const userId = req.user.id;

    // Find specialist
    const specialist = specialists.find(s => s.id === specialistId);
    if (!specialist) {
      return res.status(404).json({
        success: false,
        message: 'Specialist not found'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      userId,
      specialist: {
        id: specialist.id,
        name: specialist.name,
        email: specialist.email,
        specialty: specialist.specialty,
        image: specialist.image
      },
      patientName,
      patientEmail,
      date: new Date(date),
      time,
      sessionType,
      concern,
      status: 'Confirmed'
    });

    await appointment.save();

    // Send email to specialist
    const specialistMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: specialist.email,
      subject: 'New Appointment Booking - MindSpace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #366764;">New Appointment Booking</h2>
          <p>Dear Dr. ${specialist.name},</p>
          <p>You have a new appointment booking (ID: ${appointment.appointmentNumber}):</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Patient Name:</strong> ${patientName}</p>
            <p><strong>Patient Email:</strong> ${patientEmail}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Session Type:</strong> ${sessionType}</p>
            ${concern ? `<p><strong>Patient Concern:</strong> ${concern}</p>` : ''}
          </div>
          <p>Please log in to your dashboard to confirm the appointment.</p>
          <p>Best regards,<br/>MindSpace Team</p>
        </div>
      `
    };

    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USERNAME,
      subject: 'New Appointment Booking - MindSpace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #366764;">New Appointment Booking</h2>
          <p>A new appointment has been booked on MindSpace:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Specialist:</strong> ${specialist.name} (${specialist.specialty})</p>
            <p><strong>Patient Name:</strong> ${patientName}</p>
            <p><strong>Patient Email:</strong> ${patientEmail}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Session Type:</strong> ${sessionType}</p>
            ${concern ? `<p><strong>Patient Concern:</strong> ${concern}</p>` : ''}
          </div>
          <p>Appointment ID: ${appointment.appointmentNumber}</p>
        </div>
      `
    };

    // Send email to patient confirmation
    const patientMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: patientEmail,
      subject: 'Booking Confirmed - MindSpace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #366764;">✓ Booking Confirmed</h2>
          <p>Dear ${patientName},</p>
          <p>Your appointment has been successfully booked!</p>
          <p><strong>Appointment ID:</strong> ${appointment.appointmentNumber}</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Therapist:</strong> ${specialist.name}</p>
            <p><strong>Specialty:</strong> ${specialist.specialty}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Session Type:</strong> ${sessionType} Consultation</p>
          </div>
          <p>Your journey toward inner peace continues. We've sent a confirmation email with all the details.</p>
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard.html" style="display: inline-block; background-color: #366764; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 10px;">Go to Dashboard</a></p>
          <p>If you need to reschedule or have any questions, please contact our support team.</p>
          <p>Best regards,<br/>MindSpace Wellness Team</p>
        </div>
      `
    };

    // Send all emails
    try {
      await transporter.sendMail(specialistMailOptions);
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(patientMailOptions);
      console.log('All notification emails sent successfully');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Continue even if emails fail
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Get user appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findOne({ _id: id, userId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};
