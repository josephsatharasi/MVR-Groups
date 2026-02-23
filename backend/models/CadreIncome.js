const mongoose = require('mongoose');

const cadreIncomeSchema = new mongoose.Schema({
  cadreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cadre', required: true },
  amount: { type: Number, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

cadreIncomeSchema.index({ cadreId: 1, date: 1 });

module.exports = mongoose.model('CadreIncome', cadreIncomeSchema);
