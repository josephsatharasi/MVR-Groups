const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Email transporter (backup for OTP)
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Store OTPs temporarily (use Redis in production)
const otpStore = new Map();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, mobile, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username, email, mobile } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send OTP for password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ message: 'Please provide valid 10-digit mobile number' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this mobile number' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10 minutes expiry
    otpStore.set(mobile, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      userId: user._id
    });

    // Send OTP via Twilio
    let smsSuccess = false;
    let emailSuccess = false;
    
    try {
      console.log('Attempting to send SMS with Twilio...');
      console.log('From:', process.env.TWILIO_PHONE_NUMBER);
      console.log('To:', `+91${mobile}`);
      console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID);
      console.log('Auth Token exists:', !!process.env.TWILIO_AUTH_TOKEN);
      
      const message = await twilioClient.messages.create({
        body: `Your MVR Groups password reset OTP is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobile}`
      });
      
      console.log(`SMS sent successfully. Message SID: ${message.sid}`);
      console.log(`OTP sent to ${mobile}: ${otp}`);
      smsSuccess = true;
    } catch (twilioError) {
      console.error('Twilio Error Details:', {
        message: twilioError.message,
        code: twilioError.code,
        moreInfo: twilioError.moreInfo,
        status: twilioError.status
      });
      console.log(`Twilio failed. OTP for ${mobile}: ${otp}`);
    }
    
    // If SMS fails and user has email, try sending via email
    if (!smsSuccess && user.email) {
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_FROM || 'MVR Groups Real Estate <satharasijosephthimothi@gmail.com>',
          to: user.email,
          subject: 'MVR Groups - Password Reset OTP',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e3a8a;">MVR Groups - Password Reset</h2>
              <p>Dear ${user.username || 'User'},</p>
              <p>You have requested to reset your password. Your OTP is:</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #1e3a8a; border-radius: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p>This OTP is valid for 10 minutes.</p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 12px;">MVR Groups Real Estate Management System</p>
            </div>
          `
        });
        console.log(`Email OTP sent to ${user.email}: ${otp}`);
        emailSuccess = true;
      } catch (emailError) {
        console.error('Email Error:', emailError.message);
      }
    }
    
    // Determine response message
    let responseMessage = 'OTP sent to your mobile number';
    if (!smsSuccess && emailSuccess) {
      responseMessage = 'SMS failed. OTP sent to your registered email address';
    } else if (!smsSuccess && !emailSuccess) {
      responseMessage = 'OTP generated. Please check server logs for the OTP (Development mode)';
    }

    res.json({ message: 'OTP sent to your mobile number' });
  } catch (error) {
    console.error('General error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const storedData = otpStore.get(mobile);
    if (!storedData) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(mobile);
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: storedData.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    res.json({ message: 'OTP verified successfully', resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, password, mobile } = req.body;

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP from store
    if (mobile) {
      otpStore.delete(mobile);
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
