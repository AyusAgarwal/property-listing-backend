
const express = require('express');
const User = require('../models/user');
const Property = require('../models/property');
const auth = require('../middleware/auth');

const router = express.Router();

// Recommend a property to another user (via email)
router.post('/', auth, async (req, res) => {
  const { recipientEmail, propertyId } = req.body;

  try {
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    recipient.recommendedToMe.push({
      property: property._id,
      recommendedBy: req.user.id,
    });

    await recipient.save();
    res.json({ message: 'Property recommended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error recommending property' });
  }
});

// Get all recommendations received by the logged-in user
router.get('/received', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'recommendedToMe.property recommendedToMe.recommendedBy',
      select: 'name email location',
    });

    res.json(user.recommendedToMe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

module.exports = router;
