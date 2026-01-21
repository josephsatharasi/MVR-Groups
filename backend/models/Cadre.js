const mongoose = require('mongoose');

const cadreSchema = new mongoose.Schema({
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
  cadreId: { type: String, unique: true, sparse: true },
  companyCode: { type: String, default: '999' },
  cadreRole: String,
  cadreDhamaka: String,
  introducerRole: String,
  introducerId: String,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cadre', cadreSchema);
