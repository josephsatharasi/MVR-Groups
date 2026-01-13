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
  agentId: { type: String, unique: true },
  companyCode: { type: String, default: '999' },
  caderRole: String,
  agentDhamaka: String,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agent', agentSchema);
