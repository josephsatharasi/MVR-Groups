const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyName: { type: String, required: true },
  propertyType: { type: String, required: true, enum: ['Apartment', 'Villa', 'House', 'Commercial', 'Land'] },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  status: { type: String, enum: ['Available', 'Sold', 'Rented', 'Pending'], default: 'Available' },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  ownerEmail: String,
  description: String,
  amenities: [String],
  images: [String],
  listingDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);
