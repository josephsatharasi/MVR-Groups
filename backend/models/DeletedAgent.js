const mongoose = require('mongoose');

const deletedAgentSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  agentId: String,
  cadreId: String,
  companyCode: String,
  address: String,
  originalId: String,
  createdAt: Date,
  deletedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeletedAgent', deletedAgentSchema);