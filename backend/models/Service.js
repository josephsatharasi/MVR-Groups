const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  spareParts: { type: Object, required: true },
  totalBill: { type: Number, required: true },
  paymentMode: { type: String, required: true },
  serviceDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
