
# 🏠 Property Listing Backend API

This is a Node.js + Express backend application for managing a property listing system. It supports authentication, property management, advanced filtering, caching, favorites, and recommendations.

---

## 🚀 Features

- ✅ User registration & login (JWT auth)
- ✅ Property CRUD (Create, Read, Update, Delete)
- ✅ Advanced filtering (price, location, area, amenities, etc.)
- ✅ CSV data import into MongoDB
- ✅ Redis caching for fast filtering responses
- ✅ Favorites system for users
- ✅ Property recommendation system (bonus)

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **Caching**: Redis (via ioredis)
- **Dev Tools**: Nodemon, Postman, Git

---

## 🔐 API Endpoints

### Auth
- `POST /api/authh/register` → Register a new user
- `POST /api/authh/login` → Login and get token

### Properties
- `POST /api/properties` → Create property (auth)
- `GET /api/properties` → Get all or filtered properties
- `PUT /api/properties/:id` → Update property (auth, creator only)
- `DELETE /api/properties/:id` → Delete property (auth, creator only)

### Favorites
- `POST /api/favorites/:propertyId` → Add to favorites
- `GET /api/favorites` → View favorites
- `DELETE /api/favorites/:propertyId` → Remove favorite

### Recommendations
- `POST /api/recommendations` → Recommend property to another user (via email)
- `GET /api/recommendations/received` → View properties recommended to you

---

## ⚙️ Environment Variables

Create a `.env` file in your root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/property-listing
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

<!-- How to run locally -->
npm install
npm run dev

Bonus Features:
Caching with Redis for GET filtering
Property recommendations to other users
CSV bulk import from property-data.csv