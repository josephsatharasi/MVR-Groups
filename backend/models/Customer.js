const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationType: String,
  relation: String,
  mobile: { type: String, required: true },
  whatsapp: String,
  dob: String,
  age: String,
  address: String,
  pinCode: String,
  aadharNo: String,
  plotNo: String,
  gadhiAnkanamSqft: String,
  price: String,
  projectName: String,
  location: String,
  totalAmount: String,
  bookingAmount: String,
  balanceAmount: String,
  paymentType: String,
  chequeDD: String,
  chequeNo: String,
  bankName: String,
  agentCode: String,
  bookingDhamaka: String,
  phone: String,
  email: String,
  area: String,
  service: String,
  brand: String,
  profilePic: String,
  serviceDate: String,
  followUpStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
