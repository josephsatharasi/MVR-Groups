const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please check: 1) IP whitelist in MongoDB Atlas, 2) Network connection, 3) Credentials');
    process.exit(1);
  }
};

module.exports = connectDB;
