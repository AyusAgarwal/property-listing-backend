const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recommendedToMe: [
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    recommendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }
]

});

module.exports = mongoose.model('User', userSchema);

