const mongoose = require('mongoose');

const deletedCustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  mobile: String,
  email: String,
  address: String,
  projectName: String,
  plotNo: String,
  totalAmount: String,
  balanceAmount: String,
  originalId: String,
  deletedAt: { type: Date, default: Date.now },
  createdAt: Date
});

module.exports = mongoose.model('DeletedCustomer', deletedCustomerSchema);
