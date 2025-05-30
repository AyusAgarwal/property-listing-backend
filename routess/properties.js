
const express = require('express');
const Property = require('../models/property');
const auth = require('../middleware/auth');
// const redis = require('../utils/redisClient'); 
const router = express.Router();

// Create
router.post('/', auth, async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Error creating property' });
  }
});

// Get all with filtering
router.get('/', async (req, res) => {
  try {
    const queryKey = JSON.stringify(req.query);  // use query params as cache key

    // 1. Check Redis cache first
    // const cached = await redis.get(queryKey);
    if (cached) {
      console.log('🟢 Serving from Redis');
      return res.json(JSON.parse(cached));
    }

    // 2. Build filters as before
    const {
      location,
      propertyType,
      bedrooms,
      bathrooms,
      priceMin,
      priceMax,
      areaMin,
      areaMax,
      amenities
    } = req.query;

    const filters = {};

    if (location) filters.location = new RegExp(`^${location}$`, 'i');
    if (propertyType) filters.propertyType = propertyType;
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);
    if (bathrooms) filters.bathrooms = parseInt(bathrooms);

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = parseInt(priceMin);
      if (priceMax) filters.price.$lte = parseInt(priceMax);
    }

    if (areaMin || areaMax) {
      filters.area = {};
      if (areaMin) filters.area.$gte = parseInt(areaMin);
      if (areaMax) filters.area.$lte = parseInt(areaMax);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filters.amenities = { $all: amenitiesArray };
    }

    // 3. Query MongoDB
    const properties = await Property.find(filters);

    // 4. Cache the result
    await redis.set(queryKey, JSON.stringify(properties), 'EX', 60); // cache for 60 seconds

    console.log('🟡 Serving from MongoDB (cached)');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not allowed' });

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating property' });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not allowed' });

    await property.remove();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting property' });
  }
});

module.exports = router;
