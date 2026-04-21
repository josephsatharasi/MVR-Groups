const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationType: String,
  relation: String,
  mobile: { type: String, required: true },
  whatsapp: String,
  email: String,
  dob: String,
  age: String,
  address: String,
  pinCode: String,
  aadharNo: String,
  panNo: String,
  agentId: { type: String, unique: true, sparse: true },
  cadreId: { type: String, required: true }, // Associated cadre ID
  companyCode: { type: String, default: '999' },
  companyCode999: { type: Boolean, default: false },
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agent', agentSchema);