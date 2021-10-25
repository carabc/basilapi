const asyncHandler = require('../middleware/async');

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show all restaurants',
  });
});

// @desc    Get single restaurant
// @route   GET /api/v1/restaurants/:id
// @access  Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show single restaurant',
  });
});

// @desc    Create new restaurant
// @route   POST /api/v1/restaurants
// @access  Private
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Create Restaurant',
  });
});

// @desc    Update restaurant
// @route   PUT /api/v1/restaurants/:id
// @access  Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Update Restaurant',
  });
});

// @desc    Delete restaurant
// @route   DELTE /api/v1/restaurants/:id
// @access  Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Delete Restaurant',
  });
});
