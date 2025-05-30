
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/property');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  importData();
})
.catch(err => console.error(err));

function importData() {
  const results = [];

  fs.createReadStream('property-data.csv')
  .pipe(csv())
  .on('data', (data) => {
    const area = parseFloat(data.area);
    const listedDate = new Date(data.listedDate);

    // Skip invalid rows
    if (isNaN(area) || listedDate.toString() === 'Invalid Date') {
      console.warn('Skipping row due to invalid data:', data);
      return;
    }

    results.push({
      name: data.name,
      price: parseFloat(data.price) || 0,
      location: data.location,
      bedrooms: parseInt(data.bedrooms) || 0,
      bathrooms: parseInt(data.bathrooms) || 0,
      area: area,
      propertyType: data.propertyType,
      amenities: data.amenities ? data.amenities.split(',') : [],
      listedDate: listedDate,
      createdBy: 'system', // dummy user for now
    });
  })
  .on('end', async () => {
    try {
      await Property.insertMany(results);
      console.log('Data imported successfully!');
      process.exit();
    } catch (error) {
      console.error('Error importing data:', error);
      process.exit(1);
    }
  });
}
