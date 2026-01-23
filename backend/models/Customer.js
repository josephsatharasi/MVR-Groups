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
  cadreCode: String,
  bookingDhamaka: String,
  phone: String,
  email: String,
  profilePic: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
