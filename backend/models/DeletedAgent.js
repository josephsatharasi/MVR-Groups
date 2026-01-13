const mongoose = require('mongoose');

const deletedAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: String,
  agentId: String,
  companyCode: String,
  caderRole: String,
  address: String,
  originalId: String,
  deletedAt: { type: Date, default: Date.now },
  createdAt: Date
});

module.exports = mongoose.model('DeletedAgent', deletedAgentSchema);
