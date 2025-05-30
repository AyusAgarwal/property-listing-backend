
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// Add this near the top
const authRoutes = require('./routess/authh');
const propertyRoutes = require('./routess/properties');
const favoriteRoutes = require('./routess/favorites');
// Add route
const recommendationRoutes = require('./routess/recommendations');


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/properties', propertyRoutes);
// Routes
app.get('/', (req, res) => {
  res.send('Property Listing API is running.');
});
app.use('/api/authh', authRoutes);
// TODO: Add actual routes for auth, properties, favorites, etc.
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recommendationRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error(err));
