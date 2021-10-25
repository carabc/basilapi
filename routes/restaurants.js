const express = require('express');
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurants');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.route('/').get(getRestaurants).post(protect, createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(protect, updateRestaurant)
  .delete(protect, deleteRestaurant);

module.exports = router;
