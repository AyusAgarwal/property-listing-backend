
const express = require('express');
const Favorite = require('../models/Favorite');
const Property = require('../models/property');
const auth = require('../middleware/auth');

const router = express.Router();

// Add to favorites
router.post('/:propertyId', auth, async (req, res) => {
  try {
    const exists = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId,
    });
    if (exists) return res.status(400).json({ message: 'Already favorited' });

    const favorite = await Favorite.create({
      user: req.user.id,
      property: req.params.propertyId,
    });
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

// Get user favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate('property');
    res.json(favorites.map(fav => fav.property));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Remove from favorites
router.delete('/:propertyId', auth, async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      user: req.user.id,
      property: req.params.propertyId,
    });
    if (!result) return res.status(404).json({ message: 'Favorite not found' });

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

module.exports = router;
