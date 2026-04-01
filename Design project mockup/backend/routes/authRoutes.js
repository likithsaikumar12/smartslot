const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many reset requests. Please try again later.' }
});

const {
  registerUser,
  registerOwner,
  registerOwnerWithVerification,
  loginUser,
  loginOwner,
  loginAdmin,
  getUserProfile,
  forgotPassword,
  verifyForgotOtp,
  resetPasswordWithOtp,
  requestPasswordReset,
  resetPasswordWithToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/register/user', registerUser);
router.post('/register/owner', registerOwner);
router.post('/register-owner', registerOwnerWithVerification);

router.post('/login', loginUser);
router.post('/login/user', loginUser);
router.post('/login/owner', loginOwner);
router.post('/login/admin', loginAdmin);

router.get('/me', protect, getUserProfile);

// FEATURE 1: Forgot Password (OTP)
router.post('/forgot-password', resetLimiter, forgotPassword);
router.post('/verify-forgot-otp', verifyForgotOtp);
router.post('/reset-password-with-otp', resetPasswordWithOtp);

// FEATURE 2: Reset Password (Token)
router.post('/request-password-reset', resetLimiter, requestPasswordReset);
router.post('/reset-password-with-token', resetPasswordWithToken);

module.exports = router;
