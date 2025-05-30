const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: String,
  price: Number,
  location: String,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  propertyType: String,
  amenities: [String],
  listedDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Property', propertySchema);

