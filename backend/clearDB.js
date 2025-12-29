require('dotenv').config();
const mongoose = require('mongoose');

const clearCollection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Drop the customers collection to remove old schema
    await mongoose.connection.db.dropCollection('customers');
    console.log('Customers collection dropped successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

clearCollection();
