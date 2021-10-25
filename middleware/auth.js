const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new errorResponse('Not authorized to access this route', 401));
  }

  try {
    // Veryify token, exrtract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded.id);
    console.log(req.user);

    next();
  } catch (err) {}
});
