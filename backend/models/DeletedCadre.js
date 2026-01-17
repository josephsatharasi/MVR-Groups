const mongoose = require('mongoose');

const deletedCadreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: String,
  cadreId: String,
  companyCode: String,
  cadreRole: String,
  address: String,
  originalId: String,
  deletedAt: { type: Date, default: Date.now },
  createdAt: Date
});

module.exports = mongoose.model('DeletedCadre', deletedCadreSchema);
