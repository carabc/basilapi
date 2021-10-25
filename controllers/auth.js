const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  // Retrieve User Information
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user, include the password because we need it to validate login
  const user = await User.findOne({ email }).select('+password');

  console.log(user);
  // If no user was found in the database with the passed in email
  if (!user) {
    console.log('Crash, no user found with email');
    return next(
      new ErrorResponse(
        'Invalid credentials, no user found with the email you provided.',
        401,
      ),
    );
  }

  const isMatch = await user.matchPassword(password);

  console.log(isMatch);

  if (!isMatch) {
    console.log('Crash, user entered incorrect password');
    return next(new ErrorResponse('Incorrect password.', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1.) Get user based on POSTed email
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+password');

  // If there was no user with that email address, return next and new error resposne
  if (!user) {
    return next(
      new ErrorResponse(
        'Invalid credentials, no user found with provided email address.',
        401,
      ),
    );
  }
  // 2.) Generate the random token reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3.) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm t: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email!',
      user,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse(error.message, 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  // 1.) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    restPasswordToken: hashedToken,
    restPasswordExpire: { $gt: Date.now() },
    email,
  });
  // 2.) If token has not expired, and there is a user, set the new password
  if (!user) {
    return next(
      new ErrorResponse(
        'No user found based on reset password token, token is invalid or has expired. Try again.',
        400,
      ),
    );
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();

  // 3.) Update changedPasswordAt property for the current user
  // 4.) Log the user in, send JWT to the client
  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  // Create Token with their ID as the payload
  const token = user.getSignedJwtToken();

  // Create cookie options
  const options = {
    // set the xpire to 30 days from this time
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user });
};
